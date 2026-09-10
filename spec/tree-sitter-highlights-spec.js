const fs = require("fs");
const path = require("path");
const { Point } = require("lumine");

const HIGHLIGHTS_PATH = path.join(__dirname, "..", "grammars", "xml-highlights.scm");

describe("XML Tree-sitter highlights", () => {
  let editor;
  let languageMode;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-xml");
  });

  afterEach(() => editor?.destroy());

  async function setUp(text) {
    editor = await lumine.workspace.open("highlights.xml");
    editor.setText(text);
    languageMode = editor.getBuffer().languageMode;
    await languageMode.ready;
    expect(languageMode.tree.rootNode.hasError).toBe(false);
  }

  function rawCaptures(startRow, endRow) {
    const layer = languageMode.rootLanguageLayer;
    return layer.queries.highlightsQuery.captures(layer.tree.rootNode, {
      startPosition: new Point(startRow, 0),
      endPosition: new Point(endRow, 0),
    });
  }

  function expectLocalTile(captures, maximum) {
    expect(captures.length).toBeGreaterThan(0);
    expect(captures.length).toBeLessThanOrEqual(maximum);
    expect(
      captures.every(({ node }) => node.startPosition.row >= 3000 && node.startPosition.row < 3006),
    ).toBe(true);
  }

  it("keeps a six-row tile local inside a 6000-attribute start tag", async () => {
    const lines = [
      "<root",
      ...Array.from({ length: 6000 }, (_, index) => `  key_${index}="value_${index}"`),
      ">body</root>",
    ];
    await setUp(lines.join("\r\n"));

    expectLocalTile(rawCaptures(3000, 3006), 70);
    expect(editor.scopeDescriptorForBufferPosition([3000, 2]).getScopesArray()).toContain(
      "entity.other.attribute-name.xml",
    );
  });

  it("keeps large DTD attribute and content lists leaf-rooted", async () => {
    const attlist = [
      "<!DOCTYPE root [",
      "<!ELEMENT root EMPTY>",
      "<!ATTLIST root",
      ...Array.from({ length: 6000 }, (_, index) => `  key_${index} CDATA #IMPLIED`),
      ">",
      "]>",
      "<root/>",
    ];
    await setUp(attlist.join("\r\n"));
    expectLocalTile(rawCaptures(3000, 3006), 50);

    const contents = [
      "<!DOCTYPE root [",
      "<!ELEMENT root (",
      ...Array.from({ length: 6000 }, (_, index) => `  child_${index}${index < 5999 ? "|" : ""}`),
      ")>",
      "]>",
      "<root/>",
    ];
    editor.setText(contents.join("\r\n"));
    await languageMode.atTransactionEnd();
    expect(languageMode.tree.rootNode.hasError).toBe(false);
    expectLocalTile(rawCaptures(3000, 3006), 45);
  });

  it("keeps every unbounded XML context rooted on its captured leaf", () => {
    const query = fs.readFileSync(HIGHLIGHTS_PATH, "utf8");

    expect(query).toContain('(#is? test.childOfType "STag ETag EmptyElemTag")');
    expect(query).toContain("(#is? test.childOfType AttDef)");
    expect(query).toContain('(#is? test.typeAt "parent.parent contentspec")');
    expect(query).not.toMatch(
      /^\((?:elementdecl|contentspec|AttlistDecl|AttDef|doctypedecl|STag|ETag|EmptyElemTag)\b/m,
    );
  });
});
