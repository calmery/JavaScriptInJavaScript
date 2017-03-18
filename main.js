const calc_ast = require( './calc-ast' )

const Tokenizer = calc_ast.Tokenizer,
      Parser    = calc_ast.Parser

const dump = JSON.stringify

const fs = require( 'fs' )
const load = path => fs.readFileSync( './formula', 'utf-8' )

let lines = load( './statement' ).split( /\n+/ )
let main = { type: 'Program', body: [] }
for( let i=0; i<lines.length; i++ )
    main.body.push( new Parser( new Tokenizer( lines[i] ).getToken() ).parse() )

console.log( dump( main ) )