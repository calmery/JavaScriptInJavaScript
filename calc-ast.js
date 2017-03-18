class Literal {
    
    constructor( value ){
        this.type  = 'Literal'
        this.value = Number( value )
        this.raw   = value
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
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: this.expression()
            }]
        }
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

let str = '( 2 + 5 ) * 2'
let p = new Parser( str.split( ' ' ) )
console.log( JSON.stringify( p.parse() ) )