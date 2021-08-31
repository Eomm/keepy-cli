'use strict'

const askFor = require('../lib/askFor')
const parseArgs = require('../lib/args')
const log = require('../lib/notify')
const { needToShowHelp, extractPayloadFromFile } = require('../lib/help')
const CryptoStorage = require('../lib/CryptoStorage')

module.exports = async function (args) {
  const opts = parseArgs(args)
  needToShowHelp('add.txt', opts)

  if (!opts.key && !opts.file) {
    return log.error('❌ key parameter is mandatory', 1)
  }

  const hasPayloadValue = !!opts.payload
  const hasEnvValue = opts.env && process.env[opts.key]
  if (!hasPayloadValue && !hasEnvValue && !opts.file) {
    return log.error('❌ payload or env parameter is mandatory', 1)
  }

  const itemKey = opts.key
  let itemPayload = opts.payload

  if (opts.env && !itemPayload) {
    itemPayload = process.env[itemKey]
  }
  if (opts.file && !itemPayload) {
    itemPayload = await extractPayloadFromFile(opts.file)
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
    const add = (p, k, v, t) => { storage.store(p, k, v, t) }
    const update = (p, k, v, t) => {
      const filters = {
        key: k,
        tags: t
      }
      const dsItem = storage.read(p, filters)
      const items = dsItem.map(_ => _.index)
      storage.refresh(items, p, v)
      return items.length
    }

    if (opts.update) {
      let updates
      if (itemPayload instanceof Array) {
        // TODO this do the all decrypt every time, is not performant
        updates = itemPayload.map(([k, v]) => update(password, k, v, opts.tags))
          .reduce((tot, count) => tot + count, 0)
      } else {
        updates = update(password, itemKey, itemPayload, opts.tags)
      }
      await storage.persist()
      log.info(`👍 Updated ${updates} items`)
    } else {
      if (itemPayload instanceof Array) {
        itemPayload.forEach(([k, v]) => add(password, k, v, opts.tags))
      } else {
        add(password, itemKey, itemPayload, opts.tags)
      }
      await storage.persist()
      log.info('👍 Success')
    }
  } catch (error) {
    log.error(`❌ Error: ${error.message}`, 1)
  }
}
