class Literal {
    constructor( value ){
        this.type  = 'Literal'
        this.value = Number( value )
        this.raw   = value
    }
}

class Identifier {
    constructor( name ){
        this.type = 'Identifier'
        this.name = name
    }
}

class AssignmentExpression {
    constructor( left, right ){
        this.type  = '='
        this.left  = left
        this.right = right
    }
}

class BinaryExpression {
    constructor( operator, left, right ){
        this.type     = 'BinaryExpression'
        this.operator = operator
        this.left     = left
        this.right    = right
    }
}

module.exports = {
    Literal             : Literal,
    Identifier          : Identifier,
    AssignmentExpression: AssignmentExpression,
    BinaryExpression    : BinaryExpression
}