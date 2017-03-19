const types = require( './type' )
const token = require( './token' )

const Literal              = types.Literal,
      Identifier           = types.Identifier,
      AssignmentExpression = types.AssignmentExpression,
      BinaryExpression     = types.BinaryExpression,
      LogicalExpression    = types.LogicalExpression,
      IfStatement          = types.IfStatement,
      BlockStatement       = types.BlockStatement

class Tokenizer {
    
    constructor( formula ){
        this.formula  = formula
        this.tokens = []
        this.position = 0
        
        let str = '', ch
        const isDigit = n => [1, 1, 1, 1, 1, 1, 1, 1, 1, 1][n]
        for( let i=0; i<this.formula.length; i++ ){
            if( ch = this.peek() ){
                
                if( ch.match( RegExp( token.newline ) ) === null && ch.match( RegExp( token.space ) ) ){
                    this.next()
                    continue
                }
                
                if( ( ch === '=' && this.nextPeek() === '=' ) || ( ch === '|' && this.nextPeek() === '|' ) || ( ch === '&' && this.nextPeek() === '&' ) ){
                    if( str.length ) this.tokens.push( str )
                    str = ''
                    this.tokens.push( ch + this.nextPeek() )
                    this.next()
                    this.next()
                    continue
                }
                
                // Newline
                if( ch.match( RegExp( token.newline ) ) ){
                    if( str.length ) this.tokens.push( str )
                    str = ''
                    this.tokens.push( '\n' )
                    this.next()
                    continue
                }
                
                if( ch.match( RegExp( token.bondage ) ) || ch.match( RegExp( token.operator ) ) || ch.match( RegExp( token.bracket ) ) || ch.match( RegExp( token.braces ) ) ){
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
    
    nextPeek(){
        if( this.position + 1 < this.formula.length )
            return this.formula.charAt( this.position + 1 )
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
    
    nextPeek(){
        if( this.pos + 1 < this.tokens.length )
            return this.tokens[this.pos + 1]
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
        if( this.peek().match( token.variable ) ){
            n = new Identifier( this.poll() )
        } else {
            n = this.compareFirst()
        }
        while( ( this.peek() === '=' ) ){
            this.poll()
            n = new AssignmentExpression( n, this.bondage() )
        }
        return n
    }
    
    compareFirst(){
        let n = this.compare()
        while( ( this.peek() === '||' ) || ( this.peek() === '&&' ) ){
            console.log( this.peek() )
            n = new LogicalExpression( this.poll(), n, this.compareFirst() )
            console.log( n )
        }
        return n
    }
    
    compare(){
        let n = this.expression()
        while( ( this.peek() === '==' ) )
            n = new BinaryExpression( this.poll(), n, this.expression() )
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
            if( this.peek().match( RegExp( token.variable ) ) )
                return new Identifier( this.poll() )
            else
                return new Literal( this.poll() )
        }
    }
    
}

module.exports = {
    Tokenizer: Tokenizer,
    Parser   : Parser
}