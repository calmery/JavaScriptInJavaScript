const Parser    = require( './Parser' )
const Tokenizer = require( './Tokenizer' )
const evaluate  = require( './evaluate' )

const statement = '(+ 1 2)'

const tokens = ( new Tokenizer( statement ) ).tokens
const body   = ( new Parser( tokens ) ).body

console.log( evaluate( body ) )
