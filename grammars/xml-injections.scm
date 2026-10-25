((Comment) @injection.owner @injection.content
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))

((AttValue) @injection.owner @injection.content
  (#not-match? @injection.owner "^[\"'](https?://|mailto:)")
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))

((content [(CharData) (EntityRef) (CharRef)] @injection.content) @injection.owner
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none")
  (#set! injection.include-children)
  (#set! injection.include-adjacent-whitespace))
