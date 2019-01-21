'use strict'

const askFor = require('../lib/askFor')
const parseArgs = require('../lib/args')
const log = require('../lib/notify')
const needToShowHelp = require('../lib/help')
const CryptoStorage = require('../lib/CryptoStorage')

module.exports = async function (args) {
  let opts = parseArgs(args)
  needToShowHelp('add.txt', opts)

  if (!opts.key) {
    return log.error('❌ key parameter is mandatory', 1)
  }

  const hasPayloadValue = !!opts.payload
  const hasEnvValue = opts.env && process.env[opts.key]
  if (!hasPayloadValue && !hasEnvValue) {
    return log.error('❌ payload or env parameter is mandatory', 1)
  }

  const itemKey = opts.key
  let itemPayload = opts.payload

  if (opts.env && !itemPayload) {
    itemPayload = process.env[itemKey]
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
    if (opts.update) {
      const filters = {
        key: opts.key,
        tags: opts.tags
      }
      const dsItem = storage.read(password, filters)
      console.log(dsItem)

      // TODO update value
    } else {
      storage.store(password, itemKey, itemPayload, opts.tags)
    }
    await storage.persist()
    log.info('👍 Success')
  } catch (error) {
    log.error(`❌ Error: ${error.message}`, 1)
  }
}
