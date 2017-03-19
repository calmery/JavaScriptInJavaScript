const calc_ast = require( './calc-ast' )

const Tokenizer = calc_ast.Tokenizer,
      Parser    = calc_ast.Parser

const dump = JSON.stringify

const fs = require( 'fs' )
const load = path => fs.readFileSync( path, 'utf-8' )

let lines = load( './statement' )
let main = { type: 'Program' }
main.body = new Parser( new Tokenizer( lines ).getToken() ).parse()

console.log( dump( main ) )