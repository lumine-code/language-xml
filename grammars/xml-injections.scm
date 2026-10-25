((Comment) @injection.owner @injection.content
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))

((Attribute
  (Name) @_uri_attribute
  (AttValue) @injection.content) @injection.owner
  (#match? @_uri_attribute "^(href|src|url|uri|xmlns(:[^:]+)?|xlink:href)$")
  (#not-match? @injection.content "^[\"'](https?://|mailto:)")
  (#set! injection.language "hyperlink")
  (#set! injection.language-scope "none")
  (#set! injection.include-children))

((Attribute
  (Name) @_literal_attribute
  (AttValue) @injection.content) @injection.owner
  (#not-match? @_literal_attribute "^(href|src|url|uri|xmlns(:[^:]+)?|xlink:href)$")
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
