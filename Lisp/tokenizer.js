const expressions = {
  space : /\s/,
  braces: /[\(|\)]/,
  quote : /\'/,
}

const position = Symbol( 'position' )

class Tokenizer {

  constructor( characters ){
    this.characters = characters
    // Position is private field
    this[position]  = 0
    this.tokens     = []

    let character
    let token = ''

    // Concatenate tokens and argument
    const append = character => token += character

    // Add argument to the array of tokenized values
    const push = token => this.tokens.push( token )

    // Add token to the array of tokenized values
    const commit = () => {
      if( token !== '' ){
        this.tokens.push( token )
        token = ''
      }
    }

    while( ( character = this.characters[this[position]++] ) !== undefined ){
      // Space
      if( character.match( expressions.space ) !== null ){
        commit()
        continue
      }

      // Open parentheses of list
      if( character.match( expressions.quote ) !== null ){
        if( this.characters[this[position]].match( expressions.braces ) !== null ){
          append( character )
          append( this.characters[this[position]++] )
          commit()
          continue
        }
      }

      // Braces
      if( character.match( expressions.braces ) !== null ){
        commit()
        push( character )
        continue
      }

      // Other
      append( character )
    }
  }

}

module.exports = Tokenizer
