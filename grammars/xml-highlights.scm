; XML declaration
(XMLDecl
  "xml" @keyword.control.directive.xml)

(XMLDecl
  [
    "version"
    "encoding"
    "standalone"
  ] @entity.other.attribute-name.xml)

(XMLDecl
  (EncName) @string.other.xml)

(XMLDecl
  (VersionNum) @constant.numeric.xml)

(XMLDecl
  [
    "yes"
    "no"
  ] @constant.language.boolean.xml)

; Processing instructions
(PI) @keyword.control.directive.xml

; Element declaration
(("ELEMENT" @keyword.control.directive.define.xml)
  (#is? test.childOfType elementdecl))

((Name) @entity.name.tag.xml
  (#is? test.childOfType elementdecl))

((Name) @entity.other.attribute-name.xml
  (#is? test.typeAt "parent.parent contentspec"))

"#PCDATA" @support.type.builtin.xml

[
  "EMPTY"
  "ANY"
] @storage.modifier.xml

[
  "*"
  "?"
  "+"
] @constant.character.escape.xml

; Entity declaration
(GEDecl
  "ENTITY" @keyword.control.directive.define.xml
  (Name) @constant.other.xml)

(GEDecl
  (EntityValue) @string.quoted.double.xml)

(NDataDecl
  "NDATA" @keyword.control.xml
  (Name) @entity.name.label.xml)

; Parsed entity declaration
(PEDecl
  "ENTITY" @keyword.control.directive.define.xml
  "%" @keyword.operator.xml
  (Name) @entity.name.function.macro.xml)

(PEDecl
  (EntityValue) @string.quoted.double.xml)

; Notation declaration
(NotationDecl
  "NOTATION" @keyword.control.directive.xml
  (Name) @entity.name.label.xml)

; Attlist declaration
(("ATTLIST" @keyword.control.directive.define.xml)
  (#is? test.childOfType AttlistDecl))

((Name) @entity.name.tag.xml
  (#is? test.childOfType AttlistDecl))

((Name) @entity.other.attribute-name.xml
  (#is? test.childOfType AttDef))

((Nmtoken) @string.quoted.double.xml
  (#is? test.childOfType Enumeration)
  (#is? test.typeAt "parent.parent AttDef"))

[
  (StringType)
  (TokenizedType)
] @support.type.builtin.xml

(("NOTATION" @support.type.builtin.xml)
  (#is? test.childOfType NotationType))

[
  "#REQUIRED"
  "#IMPLIED"
  "#FIXED"
] @entity.other.attribute-name.xml

; Entities
(EntityRef) @constant.other.xml

((EntityRef) @constant.language.xml
  (#any-of? @constant.language.xml "&amp;" "&lt;" "&gt;" "&quot;" "&apos;"))

(CharRef) @string.quoted.single.xml

(PEReference) @entity.name.function.macro.xml

; External references
[
  "PUBLIC"
  "SYSTEM"
] @keyword.control.xml

(PubidLiteral) @string.other.xml

(SystemLiteral
  (URI) @markup.underline.link.xml)

; Processing instructions
(XmlModelPI
  "xml-model" @keyword.control.directive.xml)

(StyleSheetPI
  "xml-stylesheet" @keyword.control.directive.xml)

(PseudoAtt
  (Name) @entity.other.attribute-name.xml)

(PseudoAtt
  (PseudoAttValue) @string.quoted.double.xml)

; Doctype declaration
(("DOCTYPE" @keyword.control.directive.define.xml)
  (#is? test.childOfType doctypedecl))

((Name) @entity.name.type.xml
  (#is? test.childOfType doctypedecl))

; Tags
((Name) @entity.name.tag.xml
  (#is? test.childOfType "STag ETag EmptyElemTag"))

; Attributes
(Attribute
  (Name) @entity.other.attribute-name.xml)

(Attribute
  (AttValue) @string.quoted.double.xml)

; Delimiters & punctuation
;
; One pattern per side, rather than one capture for the lot: a scope is named
; for what it delimits and which end it is. `@tag.delimiter` was the Neovim
; capture name, which is not a TextMate scope at all — it themed as nothing,
; and anything selecting on `punctuation.definition.tag` (bracket-matcher's
; tag matching, for one) could not see an XML tag.
[
  "<?"
  "<"
  "</"
  "<!"
] @punctuation.definition.tag.begin.xml

[
  "?>"
  ">"
  "/>"
  "]]>"
] @punctuation.definition.tag.end.xml

"(" @punctuation.definition.group.begin.bracket.round.xml
")" @punctuation.definition.group.end.bracket.round.xml
"[" @punctuation.definition.internal-subset.begin.bracket.square.xml
"]" @punctuation.definition.internal-subset.end.bracket.square.xml

[
  "\""
  "'"
] @punctuation.definition.string.xml

[
  ","
  "|"
  "="
] @keyword.operator.xml

; Text
(CharData) @_IGNORE_.none @_IGNORE_.spell

((CDSect
  (CDStart) @entity.name.namespace.xml
  (CData) @markup.raw.xml
  "]]>" @entity.name.namespace.xml)
  )

; Misc
(Comment) @comment.line.xml @_IGNORE_.spell
