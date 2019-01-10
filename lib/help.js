'use strict'

const path = require('path')
const { readFileSync } = require('fs')

module.exports = function needToShowHelp (file, opts) {
  if (opts.help) {
    console.log(readFileSync(path.join(__dirname, '..', 'man', file), 'utf8'))
    process.exit()
  }
}
