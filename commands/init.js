'use strict'

const { version } = require('./version')

const askFor = require('../lib/askFor')
const parseArgs = require('../lib/args')
const log = require('../lib/notify')
const needToShowHelp = require('../lib/help')
const CryptoStorage = require('../lib/CryptoStorage')

module.exports = async function (args) {
  const opts = parseArgs(args)
  needToShowHelp('init.txt', opts)

  const storage = new CryptoStorage()
  const exists = await storage.exists()

  if (!opts.overwrite && exists) {
    return log.error('❌ Keepy-store already exists!', 1)
  }

  let initParameter = {
    version,
    password: '',
    hint: ''
  }

  if (opts.yes === true) {
    initParameter.password = opts.password ? opts.password : storage.randomPassword()
  } else {
    initParameter.password = await askFor.password()
    initParameter.hint = await askFor.input('Hint to reminder the password?')
  }

  try {
    storage.init(initParameter)
    await storage.persist()

    const isPasswordGenerated = opts.yes && !opts.password
    log.info(`✨ Created keepy-store.json${isPasswordGenerated ? ` with password: ${initParameter.password}` : ''}`)
  } catch (error) {
    log.error(`❌ Saving error: ${error.message}`, 1)
  }
}
