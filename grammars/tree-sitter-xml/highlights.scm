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
(elementdecl
  "ELEMENT" @keyword.control.directive.define.xml
  (Name) @entity.name.tag.xml)

(contentspec
  (_
    (Name) @entity.other.attribute-name.xml))

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
(AttlistDecl
  "ATTLIST" @keyword.control.directive.define.xml
  (Name) @entity.name.tag.xml)

(AttDef
  (Name) @entity.other.attribute-name.xml)

(AttDef
  (Enumeration
    (Nmtoken) @string.quoted.double.xml))

[
  (StringType)
  (TokenizedType)
] @support.type.builtin.xml

(NotationType
  "NOTATION" @support.type.builtin.xml)

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
(doctypedecl
  "DOCTYPE" @keyword.control.directive.define.xml)

(doctypedecl
  (Name) @entity.name.type.xml)

; Tags
(STag
  (Name) @entity.name.tag.xml)

(ETag
  (Name) @entity.name.tag.xml)

(EmptyElemTag
  (Name) @entity.name.tag.xml)

; Attributes
(Attribute
  (Name) @entity.other.attribute-name.xml)

(Attribute
  (AttValue) @string.quoted.double.xml)

; Delimiters & punctuation
[
  "<?"
  "?>"
  "<"
  ">"
  "</"
  "/>"
  "<!"
  "]]>"
] @tag.delimiter

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
