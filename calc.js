const str = '123.4 * ((1 - 5) / 4)'

const evaluate = tree => {
    
    if( tree[0] === 'lit' ){
        return Number( tree[1] ) 
    } else {
        let left  = evaluate( tree[1][0] )
        let right = evaluate( tree[1][1] )
        if( tree[0] === '+' ) return left + right
        else if( tree[0] === '-' ) return left - right
        else if( tree[0] === '*' ) return left * right
        else if( tree[0] === '/' ) return left / right
    }
    
}

const parse = str => {
    
    const statements = {
        number: /[0-9|.]/,
        operator: /[+|\-|*|\/|\%]/,
        space: /\s+/,
        brackets: {
            start: /\(/,
            end: /\)/
        }
    }
    const isMatch = ( value, exp ) => value.match( RegExp( exp ) ) !== null
    
    const middle = ( str, position, parsed, stack ) => {
        
        if( str[position] === undefined ){
            if( stack !== '' ){
                parsed.push( ['lit', stack] )
                stack = ''
            }
            return parsed
        }
        
        if( isMatch( str[position], statements.operator ) ){
            if( stack !== '' ){
                parsed.push( ['lit', stack] )
            }
            parsed.push( ['operator', str[position]] )
            stack = ''
        } else if( isMatch( str[position], statements.number ) ){
            stack = stack + str[position]
        } else if( isMatch( str[position], statements.brackets.start ) ){
            let statement_in_brackets = str.slice( position + 1 )
            let brackets = middle( statement_in_brackets, 0, [], '' )
            position = position + brackets[1] + 1
            parsed.push( ['brackets', brackets[0]] )
        } else if( isMatch( str[position], statements.brackets.end ) ){
            parsed.push( ['lit', stack] )
            stack = ''
            return [parsed, position]
        } else if( isMatch( str[position], statements.space ) ){
            'Skip'
        } else {
            console.log( 'Unknown statements : ' + str[position] )
            return []
        }
        
        return middle( str, position + 1, parsed, stack )
        
    }
    
    const tree = middle => {
        
        let position = 0
        
        // Brackets
        while( true ){
            if( middle[position] === undefined ){
                break
            }
            
            if( middle[position][0] === 'brackets' ){
                middle[position] = tree( middle[position][1] )
            }

            position = position + 1
        }
        
        position = 0
        
        // Operator
        while( true ){
            if( middle[position] === undefined ){
                break
            }
            
            if( middle[position][0] === 'operator' && ( middle[position][1] === '*' || middle[position][1] === '/' ) ){
                middle = middle.concat().splice( 0, position - 1 )
                    .concat( [[middle[position][1], [ middle[position - 1], middle[position + 1]]]] )
                    .concat( middle.splice( position + 2 ) )
            } else {
                position = position + 1
            }
        }
        
        position = 0
        
        while( true ){
            if( middle[position] === undefined ){
                break
            }

            if( middle[position][0] === 'operator' ){
                middle = middle.concat().splice( 0, position - 1 )
                    .concat( [[middle[position][1], [ middle[position - 1], middle[position + 1]]]] )
                    .concat( middle.splice( position + 2 ) )
            } else {
                position = position + 1
            }
        }
        
        return middle[0]
        
    }
    
    return tree( middle( str, 0, [], '' ) )
    
}

const tree = parse( str )
const result = evaluate( tree )

console.log( result )