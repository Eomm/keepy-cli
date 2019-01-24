'use strict'

const path = require('path')
const { readFileSync } = require('fs')
const dotenv = require('dotenv')

module.exports.needToShowHelp = function (file, opts) {
  if (opts.help || opts._.length > 0) {
    console.log(readFileSync(path.join(__dirname, '..', 'man', file), 'utf8'))
    process.exit()
  }
}

module.exports.readKeyValueFile = function (file) {
  const content = readFileSync(file, { encoding: 'utf8' })
  const kv = dotenv.parse(content)
  return Object.entries(kv)
}
