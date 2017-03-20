class Literal {
    constructor( value ){
        this.type  = 'Literal'
        this.raw   = value
        if( value.indexOf( '\'' ) !== -1 ){
            this.value = value.slice( 1, value.length-1 )
        } else {
            this.value = Number( value )
        }
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

class FunctionDeclaration {
    constructor( id, params, body ){
        this.type   = 'FunctionDeclaration'
        this.id     = id
        this.params = params
        this.body   = body
    }
}

class CallExpression {
    constructor( callee, args ){
        this.type      = 'CallExpression'
        this.callee    = callee
        this.arguments = args
    }
}

class ReturnStatement {
    constructor( args ){
        this.type = 'ReturnStatement'
        this.argument = args
    }
}

class ArrayExpression {
    constructor( elements ){
        this.type     = 'ArrayExpression'
        this.elements = elements
    }
}

class MemberExpression {
    constructor( object, property ){
        this.type     = 'MemberExpression'
        this.object   = object 
        this.property = property
    }
}

// Array like : [e][e][0]
class SequenceExpression {
    constructor( expressions ){
        this.type        = 'SequenceExpression'
        this.expressions = expressions
    }
}

module.exports = {
    Literal             : Literal,
    Identifier          : Identifier,
    AssignmentExpression: AssignmentExpression,
    BinaryExpression    : BinaryExpression,
    LogicalExpression   : LogicalExpression,
    IfStatement         : IfStatement,
    BlockStatement      : BlockStatement,
    FunctionDeclaration : FunctionDeclaration,
    CallExpression      : CallExpression,
    ReturnStatement     : ReturnStatement,
    ArrayExpression     : ArrayExpression,
    MemberExpression    : MemberExpression,
    SequenceExpression  : SequenceExpression
}