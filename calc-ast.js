const types = require( './type' )
const token = require( './token' )

const Literal              = types.Literal,
      Identifier           = types.Identifier,
      AssignmentExpression = types.AssignmentExpression,
      BinaryExpression     = types.BinaryExpression,
      LogicalExpression    = types.LogicalExpression,
      IfStatement          = types.IfStatement,
      BlockStatement       = types.BlockStatement,
      FunctionDeclaration  = types.FunctionDeclaration,
      CallExpression       = types.CallExpression,
      ReturnStatement      = types.ReturnStatement,
      ArrayExpression      = types.ArrayExpression,
      MemberExpression     = types.MemberExpression

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
                
                // String
                if( ch === '\'' ){
                    let s = ''
                    this.next() // '
                    while( true ){
                        s += this.peek()
                        this.next()
                        // Escape
                        if( this.peek() === '\\' && this.nextPeek() === '\'' ){
                            s += '\''
                            this.next()
                            this.next()
                        }
                        if( this.peek() !== '\\' && this.nextPeek() === '\'' ){
                            s += this.peek()
                            this.next()
                            break
                        }
                    }
                    this.next() // '
                    this.tokens.push( '\'' + s + '\'' )
                }
                
                // function
                if( ch === 'f' && this.nextPeek() === 'u' && this.formula[this.position+2] === 'n' && this.formula[this.position+3] === 'c' && this.formula[this.position+4] === 't' && this.formula[this.position+5] === 'i' && this.formula[this.position+6] === 'o' && this.formula[this.position+7] === 'n' ){
                    if( str.length ) this.tokens.push( str )
                    str = ''
                    this.tokens.push( 'function' )
                    this.next()
                    this.next()
                    this.next()
                    this.next()
                    this.next()
                    this.next()
                    this.next()
                    this.next()
                    continue
                }
                
                if( ch === 'r' && this.nextPeek() === 'e' && this.formula[this.position+2] === 't' && this.formula[this.position+3] === 'u' && this.formula[this.position+4] === 'r' && this.formula[this.position+5] === 'n' ){
                    if( str.length ) this.tokens.push( str )
                    str = ''
                    this.tokens.push( 'return' )
                    this.next()
                    this.next()
                    this.next()
                    this.next()
                    this.next()
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
                    // this.tokens.push( '\n' )
                    this.next()
                    continue
                }
                
                if( ch.match( RegExp( token.array ) ) || ch.match( RegExp( token.bondage ) ) || ch.match( RegExp( token.operator ) ) || ch.match( RegExp( token.bracket ) ) || ch.match( RegExp( token.braces ) ) || ch.match( RegExp( token.semi ) ) || ch.match( RegExp( token.comma ) ) ){
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
        console.log( JSON.stringify( this.tokens ) )
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
        let body = [], ret
        while( this.peek() ){
            ret = this.ifstatement()
            if( ret.type === 'IfStatement' || ret.type === 'FunctionDeclaration' || ret.type === 'ReturnStatement' ){
                body.push( ret )
            } else {
                body.push( {
                    type: 'ExpressionStatement',
                    expression: ret
                } )
            }
            if( this.peek() === ';' ) this.poll()
            if( this.peek() === '}' ) break
        }
        return body
    }
    
    ifstatement(){
        let n
        if( this.peek() === 'if' ){
            this.poll() // if
            this.poll() // (
            let test = this.bondage()
            this.poll() // )
            this.poll() // {
            let consequent
            if( this.peek() === '}' ) consequent = new BlockStatement( [] )
            else consequent = new BlockStatement( this.parse() )
            this.poll() // }
            this.poll() // else
            this.poll() // {
            let alternate 
            if( this.peek() === '}' ) alternate = new BlockStatement( [] )
            else alternate = new BlockStatement( this.parse() )
            this.poll() // }
            n = new IfStatement( test, consequent, alternate )
        } else if( this.peek() === 'function' ) {
            this.poll() // function
            let id = new Identifier( this.poll() )
            this.poll() // (
            let params = []
            while( this.peek() !== ')' ){
                if( this.peek() !== ',' ) params.push( new Identifier( this.poll() ) )
                else this.poll()
            }
            this.poll() // )
            this.poll() // {
            let body
            if( this.peek() === '}' ) body = []
            else body = new BlockStatement( this.parse() )
            this.poll() // }
            n = new FunctionDeclaration( id, params, body )
        } else {
            n = this.bondage()
        }
        return n
    }
    
    bondage(){
        let n = this.compareFirst()
        while( ( this.peek() === '=' ) ){
            this.poll()
            n = new AssignmentExpression( n, this.bondage() )
        }
        return n
    }
    
    compareFirst(){
        let n = this.compare()
        while( ( this.peek() === '||' ) || ( this.peek() === '&&' ) ){
            n = new LogicalExpression( this.poll(), n, this.compareFirst() )
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
        while( ( this.peek() === '*' ) || ( this.peek() === '/' ) ){
            n = new BinaryExpression( this.poll(), n, this.factor() )
        }
        return n
    }
    
    factor(){
        if( this.peek() === '[' ){
            
            let elem = []
            
            this.poll() // [
            while( true ){
                elem.push( this.bondage() )
                if( this.peek() === ',' ){
                    this.poll()
                }
                if( this.peek() === ']' ){
                    break
                }
            }
            this.poll() // ]
            let ar = new ArrayExpression( elem )
            
            // Like [e][0]
            
            let like = ( () => {
                
                if( this.peek() === '[' ){
                    let object   = new Identifier( this.poll() )
                    let property = this.bondage()
                    this.poll() // ]
                    ar = new MemberExpression( ar, property )
                    if( this.peek() === '[' ) return like()
                }
                
                return ar
                
            } )
            
            ar = like()
            
            return ar
            
        } else if( ( this.peek() === '(' ) ){
            this.poll()
            let n = this.bondage()
            this.poll()
            return n
        } else {
            if( this.peek().match( RegExp( token.variable ) ) ){
                if( this.nextPeek() === '(' ){
                    
                    let id = new Identifier( this.poll() )
                    this.poll() // (
                    let params = []
                    while( this.peek() !== ')' ){
                        if( this.peek() === ',' ){
                            this.poll()
                            continue
                        }
                        params.push( this.bondage() )
                    }
                    this.poll() // )
                    return new CallExpression( id, params )
                    
                } else if( this.peek() === 'return' ) {
                    this.poll()
                    // return 直後に () があると関数として認識されてしまう
                    return new ReturnStatement( this.bondage() )
                } else {
                    if( this.peek()[0] === '\'' && this.peek()[this.peek().length-1] === '\'' ){
                        return new Literal( this.poll() )
                    } else if( this.nextPeek() === '[' ){
                        
                        let object   = new Identifier( this.poll() )
                        this.poll() // [
                        let property = this.bondage()
                        this.poll() // ]
                        let ar = new MemberExpression( object, property )
                        
                        return ar
                        
                    } else return new Identifier( this.poll() )
                }
            } else
                return new Literal( this.poll() )
        }
    }
    
}

module.exports = {
    Tokenizer: Tokenizer,
    Parser   : Parser
}