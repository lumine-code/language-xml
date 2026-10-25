// Authentic package usage. Run with lumine/script/demo.js; fixtures stay in demo/.
module.exports = {
  version: 1,
  dependencies: ["language-hyperlink"],
  viewport: { width: 1100, height: 670 },
  async before() {},
  async prepare(context) {
    const { lumine, state, open } = context;
    state.editor = await open("example.xml");

    if (!lumine.grammars.assignLanguageMode(state.editor.getBuffer(), "text.xml"))
      throw new Error("Grammar unavailable");
    await state.editor.getBuffer().getLanguageMode().ready;
    await state.editor.getBuffer().getLanguageMode().atGrammarSettlement?.();
    if (state.editor.getGrammar().scopeName !== "text.xml") throw new Error("Wrong grammar");
    state.editor.setCursorBufferPosition([0, 0]);
    state.editor.scrollToBufferPosition([0, 0]);
  },
  scenes: [
    {
      id: "scene-1",
      file: "demo.png",
      caption: "XML syntax highlighting at the default editor font size.",
      timeout: 60000,
      async run() {},
      ready(context) {
        const { state } = context;
        return Boolean(
          state.editor
            .scopeDescriptorForBufferPosition([3, 17])
            .getScopesArray()
            .includes("markup.underline.link.xml") &&
          state.editor.getElement().getBoundingClientRect().height > 0,
        );
      },
    },
  ],
  async cleanup() {},
};
