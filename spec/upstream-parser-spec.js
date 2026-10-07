describe("XML scanner tag ownership", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-xml");
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("text.xml"));
  });

  afterEach(() => editor?.destroy());

  it("keeps nested and self-closing tags valid across repeated incremental edits", async () => {
    editor.setText(`<root>${"<item><name>value</name><empty/></item>".repeat(200)}</root>`);
    await editor.languageMode.ready;
    for (let index = 0; index < 10; index++) {
      const buffer = editor.getBuffer();
      const start = editor.getText().indexOf("value");
      buffer.setTextInRange(
        [buffer.positionForCharacterIndex(start), buffer.positionForCharacterIndex(start + 5)],
        "value",
      );
      await editor.languageMode.atTransactionEnd();
      expect(editor.languageMode.tree.rootNode.hasError).toBe(false);
    }
    expect(editor.languageMode.tree.rootNode.descendantsOfType("EmptyElemTag").length).toBe(200);
  });
});
