'use strict'

const path = require('path')
const { readFileSync } = require('fs')

module.exports = function needToShowHelp (file, opts) {
  if (opts.help || opts._.length > 0) {
    console.log(readFileSync(path.join(__dirname, '..', 'man', file), 'utf8'))
    process.exit()
  }
}
