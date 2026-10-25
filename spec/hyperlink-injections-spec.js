const { Range } = require("lumine");

const URL = "https://example.com/manual.pdf?first=1&amp;second=2";
const LINK_SCOPE = "markup.underline.link.hyperlink";
const XML_LINK_SCOPE = "markup.underline.link.xml";

describe("XML hyperlink injections", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-hyperlink");
    await lumine.packages.activatePackage("language-xml");
  });

  afterEach(() => editor?.destroy());

  for (const [name, text, scope] of [
    ["comments", String.raw`<!-- \href{${URL}}{Manual} --><manual/>`, LINK_SCOPE],
    ["attributes", `<manual href="${URL}"/>`, XML_LINK_SCOPE],
    ["text content", String.raw`<manual>\href{${URL}}{Manual}</manual>`, LINK_SCOPE],
  ]) {
    it(`highlights the exact URL in ${name}`, async () => {
      editor = await lumine.workspace.open();
      editor.setText(text);
      lumine.grammars.assignLanguageMode(editor.getBuffer(), "text.xml");
      await editor.whenGrammarSettled();
      await editor.languageMode.refresh?.();
      const buffer = editor.getBuffer();
      const index = text.indexOf(URL);
      const range = new Range(
        buffer.positionForCharacterIndex(index),
        buffer.positionForCharacterIndex(index + URL.length),
      );
      expect(editor.bufferRangeForScopeAtPosition(`.${scope}`, range.start)).toEqual(range);
      expect(editor.scopeDescriptorForBufferPosition(range.end).getScopesArray()).not.toContain(
        scope,
      );
    });
  }

  it("updates an attribute URL without consuming its quotes or neighboring attributes", async () => {
    editor = await lumine.workspace.open();
    editor.setText('<manual href="https://example.com/old" title="Manual"/>');
    lumine.grammars.assignLanguageMode(editor.getBuffer(), "text.xml");
    await editor.whenGrammarSettled();
    const replacement = "https://example.com/%7Bmanual%7D.pdf";
    editor.getBuffer().setTextInRange(
      [
        [0, 14],
        [0, 37],
      ],
      replacement,
    );
    await editor.languageMode.atTransactionEnd();
    await editor.languageMode.refresh?.();
    const range = new Range([0, 14], [0, 14 + replacement.length]);
    expect(editor.getTextInBufferRange(range)).toBe(replacement);
    expect(editor.bufferRangeForScopeAtPosition(`.${XML_LINK_SCOPE}`, range.start)).toEqual(range);
    expect(editor.scopeDescriptorForBufferPosition(range.end).getScopesArray()).not.toContain(
      XML_LINK_SCOPE,
    );
  });

  it("keeps text URL runs separate across tags and comments", async () => {
    const url = "https://example.com/manual.pdf";
    for (const boundary of ["<empty/>", "<!-- comment -->"]) {
      editor = await lumine.workspace.open();
      editor.setText(`<manual>${url}${boundary}Tail</manual>`);
      lumine.grammars.assignLanguageMode(editor.getBuffer(), "text.xml");
      await editor.whenGrammarSettled();
      await editor.languageMode.refresh?.();
      const range = new Range([0, 8], [0, 8 + url.length]);
      expect(editor.bufferRangeForScopeAtPosition(`.${LINK_SCOPE}`, range.start)).toEqual(range);
      expect(editor.scopeDescriptorForBufferPosition(range.end).getScopesArray()).not.toContain(
        LINK_SCOPE,
      );
      editor.destroy();
    }
  });

  for (const destination of [
    "https://example.com/?last=&amp;",
    "https://example.com/a path_(draft)?last=*",
    "mailto:maintainer@example.com?subject=Manual",
  ]) {
    it(`preserves the entire structured attribute destination ${destination}`, async () => {
      for (const quote of ['"', "'"]) {
        editor = await lumine.workspace.open();
        editor.setText(`<manual href=${quote}${destination}${quote}/>`);
        lumine.grammars.assignLanguageMode(editor.getBuffer(), "text.xml");
        await editor.whenGrammarSettled();
        await editor.languageMode.refresh?.();
        const range = new Range([0, 14], [0, 14 + destination.length]);
        expect(editor.bufferRangeForScopeAtPosition(`.${XML_LINK_SCOPE}`, range.start)).toEqual(
          range,
        );
        expect(editor.getTextInBufferRange(range)).toBe(destination);
        expect(editor.scopeDescriptorForBufferPosition([0, 13]).getScopesArray()).not.toContain(
          XML_LINK_SCOPE,
        );
        expect(editor.scopeDescriptorForBufferPosition(range.end).getScopesArray()).not.toContain(
          XML_LINK_SCOPE,
        );
        expect(editor.scopeDescriptorForBufferPosition(range.start).getScopesArray()).not.toContain(
          LINK_SCOPE,
        );
        editor.destroy();
      }
    });
  }

  it("keeps prose attributes on the annotation grammar", async () => {
    editor = await lumine.workspace.open();
    editor.setText(String.raw`<manual title="Read \href{${URL}}{Manual}"/>`);
    lumine.grammars.assignLanguageMode(editor.getBuffer(), "text.xml");
    await editor.whenGrammarSettled();
    await editor.languageMode.refresh?.();
    const start = editor.getText().indexOf(URL);
    const range = new Range([0, start], [0, start + URL.length]);
    expect(editor.bufferRangeForScopeAtPosition(`.${LINK_SCOPE}`, range.start)).toEqual(range);
    expect(editor.scopeDescriptorForBufferPosition(range.end).getScopesArray()).not.toContain(
      LINK_SCOPE,
    );
  });

  for (const name of ["title", "data-note", "HREF"]) {
    it(`keeps HTTP-prefixed prose in ${name} separate from its URL`, async () => {
      const url = "https://example.com/manual.pdf";
      editor = await lumine.workspace.open();
      editor.setText(`<manual ${name}="${url} is the manual"/>`);
      lumine.grammars.assignLanguageMode(editor.getBuffer(), "text.xml");
      await editor.whenGrammarSettled();
      await editor.languageMode.refresh?.();
      const start = editor.getText().indexOf(url);
      const range = new Range([0, start], [0, start + url.length]);
      expect(editor.bufferRangeForScopeAtPosition(`.${LINK_SCOPE}`, range.start)).toEqual(range);
      expect(editor.scopeDescriptorForBufferPosition(range.start).getScopesArray()).not.toContain(
        XML_LINK_SCOPE,
      );
      expect(editor.scopeDescriptorForBufferPosition(range.end).getScopesArray()).not.toContain(
        LINK_SCOPE,
      );
    });
  }

  it("retains native boundaries for a complete URI in an arbitrary attribute", async () => {
    const url = "https://example.com/?last=&amp;";
    editor = await lumine.workspace.open();
    editor.setText(`<manual title="${url}"/>`);
    lumine.grammars.assignLanguageMode(editor.getBuffer(), "text.xml");
    await editor.whenGrammarSettled();
    await editor.languageMode.refresh?.();
    const start = editor.getText().indexOf(url);
    const range = new Range([0, start], [0, start + url.length]);
    expect(editor.bufferRangeForScopeAtPosition(`.${XML_LINK_SCOPE}`, range.start)).toEqual(range);
    expect(editor.scopeDescriptorForBufferPosition(range.start).getScopesArray()).not.toContain(
      LINK_SCOPE,
    );
  });
});
