const isDigit = n => [1, 1, 1, 1, 1, 1, 1, 1, 1, 1][n]

class Source {
    
    constructor( str ){
        this.str = str
        this.pos = 0
    }
    
    peek(){
        if( this.pos < this.str.length )
            return this.str.charAt( this.pos )
        return -1
    }
    
    next(){
        this.pos++
    }
    
}

class Parser extends Source {
    
    constructor( str ){
        super( str )
    }
    
    number(){
        let sb = ''
        let ch
        while( ( ch = this.peek() ) >= 0 && isDigit( ch ) ){
            sb += String( ch )
            this.next()
        }
        return Number( sb.toString() )
    }
    
    expr(){
        let x = this.term()
        for( ;; ){
            switch( this.peek() ){
                case '+' :
                    this.next()
                    x += this.term()
                    continue
                case '-' :
                    this.next()
                    x -= this.term()
                    continue
            }
            break
        }
        return x
    }
    
    term(){
        let x = this.factor()
        for( ;; ){
            switch( this.peek() ){
                case '*' :
                    this.next()
                    x *= this.factor()
                    continue
                case '/' :
                    this.next()
                    x /= this.factor()
                    continue
            }
            break
        }
        return x
    }
    
    factor(){
        let ret
        this.spaces()
        if( this.peek() === '(' ){
            this.next()
            ret = this.expr()
            if( this.peek() === ')' )
                this.next()
        } else
            ret = this.number()
        this.spaces()
        return ret
    }
    
    spaces(){
        while( this.peek() === ' ' )
            this.next()
    }
    
}

console.log( new Parser("( 2    +3) * 4  ").expr() )