; Only named resources are useful navigation targets in generic XML.
; Anonymous structural tags, text and ordinary attribute values stay out.
(element
  [(STag (Attribute
      (Name) @_attribute
      (AttValue) @name))
   (EmptyElemTag (Attribute
      (Name) @_attribute
      (AttValue) @name))]
  (#any-of? @_attribute "id" "xml:id" "name")
  (#match? @name "[^'\"\\s]")
  (#set! symbol.strip "^['\"]|['\"]$")) @definition.object
