'use strict'

const { prompt } = require('enquirer')

const parseArgs = require('../lib/args')
const log = require('../lib/log')
const needToShowHelp = require('../lib/help')
const CryptoStorage = require('../lib/CryptoStorage')

module.exports = async function (args) {
  let opts = parseArgs(args)
  needToShowHelp('add.txt', opts)

  // TODO opts

  const storage = new CryptoStorage()
  try {
    await storage.load()
  } catch (error) {
    log.error('❌ keepy-store doesn\'t exists, call init first')
    return
  }

  let password = null
  if (storage.isSecured()) {
    const question = {
      type: 'password',
      name: 'password',
      message: `Input password -${storage.reminder}-`
    }
    password = (await prompt(question)).password
  }

  try {
    storage.store(password, 'k', 'p', ['l1', 'l2'])
    await storage.persist()
    log.info('👍 Success')
  } catch (error) {
    log.error(`❌ Error: ${error.message}`)
  }
}
