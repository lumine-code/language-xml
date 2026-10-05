; Named and matching templates are navigation targets; output markup is not.
(element
  [(STag (Name) @_tag
    (Attribute (Name) @_attribute (AttValue) @name))
   (EmptyElemTag (Name) @_tag
    (Attribute (Name) @_attribute (AttValue) @name))]
  (#eq? @_tag "xsl:template")
  (#any-of? @_attribute "name" "match")
  (#set! symbol.strip "^['\"]|['\"]$")) @definition.function

(element
  [(STag (Name) @_tag
    (Attribute (Name) @_attribute (AttValue) @name))
   (EmptyElemTag (Name) @_tag
    (Attribute (Name) @_attribute (AttValue) @name))]
  (#any-of? @_tag "xsl:variable" "xsl:param")
  (#eq? @_attribute "name")
  (#set! symbol.strip "^['\"]|['\"]$")) @definition.variable

(element
  [(STag (Name) @_tag
    (Attribute (Name) @_attribute (AttValue) @name))
   (EmptyElemTag (Name) @_tag
    (Attribute (Name) @_attribute (AttValue) @name))]
  (#eq? @_tag "xsl:function")
  (#eq? @_attribute "name")
  (#set! symbol.strip "^['\"]|['\"]$")) @definition.function
