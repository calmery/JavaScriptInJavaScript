const evaluate = program => {

  const operator = program.shift()

  if( operator === '+' ){
    const x = program.shift()
    const y = program.shift()
    return x + y
  }

}

module.exports = evaluate
