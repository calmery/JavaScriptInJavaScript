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

const token = {
    operator: /\+|\-|\*|\//,
    space: /\s+/,
    bracket: /[\(|\)]/,
    bondage: /\=/,
    variable: /[a-z|A-Z|_|$][a-z|A-Z|0-9|_|$]+/
}

class Tokenizer {
    
    constructor( formula ){
        this.formula  = formula
        this.tokens = []
        this.position = 0
        
        let str = '', ch
        const isDigit = n => [1, 1, 1, 1, 1, 1, 1, 1, 1, 1][n]
        for( let i=0; i<this.formula.length; i++ ){
            if( ch = this.peek() ){
                if( ch.match( RegExp( token.space ) ) ){
                    this.next()
                    continue
                }
                if( ch.match( RegExp( token.operator ) ) || ch.match( RegExp( token.bracket ) ) || ch.match( RegExp( token.bondage ) ) ){
                    if( str.length ) this.tokens.push( str )
                    str = ''
                    this.tokens.push( ch )
                } else {
                    str += ch
                }
            }
            this.next()
        }
        if( str.length ) this.tokens.push( str )
    }
    
    peek(){
        if( this.position < this.formula.length )
            return this.formula.charAt( this.position )
        return false
    }
    
    next(){
        this.position++
    }
    
    getToken(){
        return this.tokens
    }
    
}

class Parser {
    
    constructor( tokens ){
        this.tokens = tokens
        this.pos    = 0
    }
    
    peek(){
        if( this.pos < this.tokens.length )
            return this.tokens[this.pos]
        return null
    }
    
    poll(){
        return this.tokens[this.pos++]
    }
    
    parse(){
        return {
            type: 'ExpressionStatement',
            expression: this.bondage()
        }
    }
    
    bondage(){
        let n
        if( this.peek().match( token.variable ) )
            n = new Identifier( this.poll() )
        else
            n = this.expression()
        while( ( this.peek() === '=' ) ){
            this.poll()
            n = new AssignmentExpression( n, this.bondage() )
        }
        return n
    }
    
    expression(){
        let n = this.term()
        while( ( this.peek() === '+' ) || ( this.peek() === '-' ) )
            n = new BinaryExpression( this.poll(), n, this.term() )
        return n
    }
    
    term(){
        let n = this.factor()
        while( ( this.peek() === '*' ) || ( this.peek() === '/' ) )
            n = new BinaryExpression( this.poll(), n, this.factor() )
        return n
    }
    
    factor(){
        if( ( this.peek() === '(' ) ){
            this.poll()
            let n = this.expression()
            this.poll()
            return n
        } else {
            return new Literal( this.poll() )
        }
    }
    
}

let str = 'abc = ( 2 + 5) * 2\n2 + 4123'
let lines = str.split( /\n+/ )
let main = { type: 'Program', body: [] }
for( let i=0; i<lines.length; i++ )
    main.body.push( new Parser( new Tokenizer( lines[i] ).getToken() ).parse() )

console.log( JSON.stringify( main ) )