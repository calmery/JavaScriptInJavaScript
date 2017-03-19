const token = {
    operator: /\+|\-|\*|\//,
    space   : /\s+/,
    bracket : /[\(|\)]/,
    bondage : /\=/,
    variable: /[a-z|A-Z|_|$][a-z|A-Z|0-9|_|$]*/,
    braces  : /\{|\}/,
    newline : /\n+/,
    semi    : /\;/,
    comma   : /\,/
}

module.exports = token