// XML declarations and ordinary extensions resolve to the Tree-sitter parser.

describe("XML grammar selection", () => {
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-xml");
  });

  function selectedFor(fileName, contents) {
    return lumine.grammars.selectGrammar(fileName, contents);
  }

  it("prefers the Tree-sitter grammar for a file with an XML declaration", () => {
    const grammar = selectedFor("sample.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<a/>\n');

    expect(grammar.scopeName).toBe("text.xml");
    expect(grammar.constructor.name).toBe("TreeSitterGrammar");
  });

  it("prefers the Tree-sitter grammar for a file without one", () => {
    const grammar = selectedFor("sample.xml", "<a/>\n");

    expect(grammar.scopeName).toBe("text.xml");
    expect(grammar.constructor.name).toBe("TreeSitterGrammar");
  });

  it("uses a root-only XSL descriptor", () => {
    const grammar = selectedFor(
      "transform.xsl",
      '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"/>',
    );

    expect(grammar.scopeName).toBe("text.xml.xsl");
    expect(grammar.type).toBe("tree-sitter");
    expect(grammar.injectionNames).toEqual([]);
  });
});
