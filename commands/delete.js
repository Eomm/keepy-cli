'use strict'

const askFor = require('../lib/askFor')
const parseArgs = require('../lib/args')
const log = require('../lib/notify')
const { needToShowHelp } = require('../lib/help')
const CryptoStorage = require('../lib/CryptoStorage')

module.exports = async function (args) {
  let opts = parseArgs(args)
  needToShowHelp('delete.txt', opts)

  if (!opts.key && opts.tags.length === 0) {
    return log.error('❌ key or tags parameter are mandatory', 1)
  }

  const storage = new CryptoStorage()
  try {
    await storage.load()
  } catch (error) {
    return log.error('❌ keepy-store doesn\'t exists, call init first', 1)
  }

  let password = opts.password || null
  if (storage.isSecured() && password === null) {
    password = await askFor.password(storage.reminder)
  }

  try {
    const filters = {
      key: opts.key,
      tags: opts.tags
    }
    storage.erase(password, filters)
    await storage.persist()
    log.info('👍 Success')
  } catch (error) {
    log.error(`❌ Error: ${error.message}`, 1)
  }
}
