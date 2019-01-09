'use strict'

const parseArgs = require('../lib/args')
const CryptoStorage = require('../lib/CryptoStorage')

module.exports = async function (args) {
  let opts = parseArgs(args)
  console.log('restore', opts)

  // TODO

  const storage = new CryptoStorage()
  await storage.load()
}
