((Comment) @injection.owner @injection.content
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))

((Attribute
  (Name) @_IGNORE_.uri-attribute
  (AttValue) @injection.content) @injection.owner
  (#match? @_IGNORE_.uri-attribute "^(href|src|url|uri|xmlns(:[^:]+)?|xlink:href)$")
  (#not-match? @injection.content "^[\"'](https?://|mailto:)")
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))

((Attribute
  (Name) @_IGNORE_.literal-attribute
  (AttValue) @injection.content) @injection.owner
  (#not-match? @_IGNORE_.literal-attribute "^(href|src|url|uri|xmlns(:[^:]+)?|xlink:href)$")
  (#not-match? @injection.content "^[\"'](https?://|mailto:)\\S*[\"']$")
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))

((DefaultDecl (AttValue) @injection.content) @injection.owner
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))

((content [(CharData) (EntityRef) (CharRef)] @injection.content) @injection.owner
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none")
  (#set! injection.include-children)
  (#set! injection.include-adjacent-whitespace))
