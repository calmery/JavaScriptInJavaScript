const atom = token => {
  const number = Number( token )
  if( Number.isNaN( number ) === true )
    return token
  else
    return number
}

const read_from_tokens = xs => {
  if( xs.length === 0 )
    throw new SyntaxError( 'Unexpected EOF while reading' )

  const x = xs.shift()

  if( x === '(' ){
    let arguments = []
    while( xs[0] !== ')' )
      arguments.push( read_from_tokens( xs ) )
    xs.shift()
    return arguments
  }

  if( x === ')' )
    throw new SyntaxError( 'Unexpected )' )

  return atom( x )
}

class Parser {

  constructor( tokens ){
    this.body = read_from_tokens( tokens )
  }

}

module.exports = Parser
