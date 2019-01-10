'use strict'

const parseArgs = require('../lib/args')
const needToShowHelp = require('../lib/help')
const CryptoStorage = require('../lib/CryptoStorage')

module.exports = async function (args) {
  let opts = parseArgs(args)
  needToShowHelp('backup.txt', opts)

  // TODO

  const storage = new CryptoStorage()
  await storage.load()
}
