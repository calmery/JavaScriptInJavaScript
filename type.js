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
        this.type     = 'AssignmentExpression'
        this.operator = '='
        this.left     = left
        this.right    = right
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

class LogicalExpression {
    constructor( operator, left, right ){
        this.type     = 'LogicalExpression'
        this.operator = operator
        this.left     = left
        this.right    = right
    }
}

class IfStatement {
    constructor( test, consequent, alternate ){
        this.type       = 'IfStatement'
        this.test       = test
        this.consequent = consequent
        this.alternate  = alternate
    }
}

class BlockStatement {
    constructor( body ){
        this.type = 'BlockStatement'
        this.body = body
    }
}

module.exports = {
    Literal             : Literal,
    Identifier          : Identifier,
    AssignmentExpression: AssignmentExpression,
    BinaryExpression    : BinaryExpression,
    LogicalExpression   : LogicalExpression,
    IfStatement         : IfStatement,
    BlockStatement      : BlockStatement
}