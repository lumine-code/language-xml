// A first-line match is worth 0.5 to a grammar's score, and preferring
// Tree-sitter is worth only 0.1. So whenever a TextMate grammar declares
// `firstLineMatch` and its Tree-sitter twin declares no `firstLineRegex`, every
// file whose first line matches quietly gets the TextMate grammar — here, any
// file that opens with an XML declaration, which is very nearly all of them.

describe("XML grammar selection", () => {
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-xml");
    lumine.config.set("language.useTreeSitterParsers", true);
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

  it("still honours the TextMate preference", () => {
    lumine.config.set("language.useTreeSitterParsers", false);

    const grammar = selectedFor("sample.xml", '<?xml version="1.0"?>\n<a/>\n');

    expect(grammar.scopeName).toBe("text.xml");
    expect(grammar.constructor.name).toBe("Grammar");
  });
});
