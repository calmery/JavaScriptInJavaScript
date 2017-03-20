const evaluate = ( tree, lenv, genv ) => {
    
    if( tree.type === 'Program' || tree.type === 'BlockStatement' ){
        let last
        for( let i=0; i<tree.body.length; i++ ){
            last = evaluate( tree.body[i], lenv, genv )
        }
        return last
    }
    
    if( tree.type === 'IfStatement' ){
        let test = evaluate( tree.test, lenv, genv )
        if( test ){
            return evaluate( tree.consequent, lenv, genv )
        } else {
            return evaluate( tree.alternate, lenv, genv )
        }
    }
    
    if( tree.type === 'ArrayExpression' ){
        let elements = tree.elements
        let arr = []
        for( let i=0; i<elements.length; i++ ){
            arr.push( elements[i] )
        }
        return arr
    }
    
    if( tree.type === 'ObjectExpression' ){
        let properties = tree.properties
        let hash = {}
        for( let i=0; i<properties.length; i++ ){
            let key = properties[i].key.name
            let value = properties[i].value
            hash[key] = value
        }
        return hash
    }
    
    if( tree.type === 'MemberExpression' ){
        let name = tree.object.name
        if( tree.property.type === 'MemberExpression' ){
            tree.property = { value: evaluate( tree.property, lenv, genv ) }
        }
        return evaluate( lenv[name][tree.property.value], lenv, genv )
    }
    
    if( tree.type === 'ReturnStatement' ){
        return evaluate( tree.argument, lenv, genv )
    }
    
    if( tree.type === 'CallExpression' ){
        
        if( typeof genv[tree.callee.name] === 'function' ){
            let arg = tree.arguments
            for( let i=0; i<arg.length; i++ ){
                arg[i] = evaluate( arg[i], lenv, genv )
            }
            genv[tree.callee.name].apply( this, arg )
        } else {
            let fn  = JSON.parse( JSON.stringify( genv[tree.callee.name] ) )
            let arg = tree.arguments
            for( let i=0; i<arg.length; i++ ){
                arg[i] = evaluate( arg[i], lenv, genv )
            }
            
            let new_lenv = {}
            for( let i=0; i<fn.params.length; i++ ){
                new_lenv[fn.params[i].name] = arg[i]
            }
            return evaluate( fn.body, new_lenv, genv )
        }
    }
    
    if( tree.type === 'AssignmentExpression' ){
        lenv[tree.left.name] = evaluate( tree.right, lenv, genv )
        return lenv
    }
    
    if( tree.type === 'Identifier' ){
        return lenv[tree.name]
    }
    
    if( tree.type === 'Literal' ){
        return tree.value
    }
    
    if( tree.type === 'ExpressionStatement' ){
        return evaluate( tree.expression, lenv, genv )
    }
    
    if( tree.type === 'LogicalExpression' ){
        let left  = evaluate( tree.left, lenv, genv )
        let right = evaluate( tree.right, lenv, genv )
        if( tree.operator === '&&' ) return left && right
        if( tree.operator === '||' ) return left || right
    }
    
    if( tree.type === 'BinaryExpression' ){
        let left  = evaluate( tree.left, lenv, genv )
        let right = evaluate( tree.right, lenv, genv )
        if( tree.operator === '+' )  return left + right
        if( tree.operator === '-' )  return left - right
        if( tree.operator === '*' )  return left * right
        if( tree.operator === '/' )  return left / right
        if( tree.operator === '%' )  return left % right
        if( tree.operator === '==' ) return left == right
        if( tree.operator === '!=' ) return left != right
    }
    
    if( tree.type === 'FunctionDeclaration' ){
        genv[tree.id.name] = tree
    }
    
    return tree
    
}

module.exports = evaluate