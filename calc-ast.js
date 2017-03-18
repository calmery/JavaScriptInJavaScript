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

class Tokenizer {
    
    constructor( formula ){
        this.formula  = formula
        this.tokens = []
        this.position = 0
        
        let str = '', ch
        const isDigit = n => [1, 1, 1, 1, 1, 1, 1, 1, 1, 1][n]
        for( let i=0; i<this.formula.length; i++ ){
            if( ch = this.peek() ){
                if( isDigit( ch ) ){
                    str += ch
                } else {
                    if( str.length ) this.tokens.push( str )
                    if( ch !== ' ' ) this.tokens.push( ch )
                    str = ''
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

let str = '( 2 + 5) * 2'
console.log( JSON.stringify( new Parser( new Tokenizer( str ).tokens ).parse() ) )