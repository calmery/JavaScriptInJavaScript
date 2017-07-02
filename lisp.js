( () => {

  const readline = require( 'readline' )

  const rl = readline.createInterface( {
    input : process.stdin,
    output: process.stdout
  } )

  // Convert a string of characters into a list of tokens.
  const tokenize = characters => {
    let token = characters.replace( /\(/g, ' ( ' )
                          .replace( /\)/g, ' ) ' )
                          .split( /\s+/ )
    token.shift()
    token.pop()
    return token
  }

  // Numbers become numbers; every other token is a symbol.
  const atom = token => {
    let n = Number( token )
    if( Number.isNaN( n ) )
      return token
    return n
  }

  // Read an expression from a sequence of tokens.
  const read_from_tokens = tokens => {
    tokens = [].slice.call( tokens )

    if( tokens.length === 0 )
      throw new SyntaxError( 'Unexpected EOF while reading' )

    let token = tokens.shift()

    switch( token ){
      case '(' :
        let L = []
        while( tokens[0] !== ')' ){
          L.push( read_from_tokens( tokens ) )
          tokens.shift()
        }
        tokens.shift() // pop off ')'
        return L
        break
      case ')' :
        throw new SyntaxError( 'Unexpected )' )
        break
      default :
        return atom( token )
    }
  }

  // Read a Scheme expression from a string.
  const parse = program => read_from_tokens(
    tokenize( program )
  )

  // An environment with some Sceheme standard procedures.
  const standard_env = () => {
    return {
      nil : null,
      car : xs => { return xs[0] },
      cdr : xs => { return xs.slice( 1 ) },
      cons: ( x, y ) => { return [x] + y },
      eq  : ( x, y ) => { return x === y },
      '+' : ( x, y ) => { return x + y },
      '-' : ( x, y ) => { return x - y },
      '*' : ( x, y ) => { return x * y },
      '/' : ( x, y ) => { return x / y }
    }
  }

  // Evaluate an expression in an environment.
  const eval = ( x, env ) => {
    if( env === undefined )
      env = standard_env()

    if( typeof x === 'string' )
      return x.valueOf()
    else if( Array.isArray( x ) === false )
      return x.valueOf()
    else if( x[0] === 'if' ){
      let _      = x[0],
          test   = x[1],
          conseq = x[2],
          alt    = x[3]
      let exp = eval( test, env ) ? conseq : alt
      return eval( exp, env )
    } else {
      let proc = eval( x[0], env )
      let args = []
      for( let i=1; i<x.length; i++ ){
        args.push( eval( x[i], env ) )
      }
      return env[proc].apply( this, args )
    }
  }

  // A prompt-read-eval-print loop.
  const repl = () => {
    rl.question( 'lisp > ', formula => {
      let value = eval( parse( formula ) )
      if( value !== undefined )
        console.log( '; =>', value )
      repl()
    } )
  }

  repl()

} )()
