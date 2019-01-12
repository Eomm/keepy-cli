'use strict'

const { prompt } = require('enquirer')

const { version } = require('./version')

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
    try {
      initParameter = await askParameters()
    } catch (error) {
      return log.error('❌ Operation cancelled', 2)
    }
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

function askParameters () {
  const question = [
    {
      type: 'password',
      name: 'password',
      message: 'keepy-storage password?'
    },
    {
      type: 'input',
      name: 'hint',
      message: 'Hint to reminder the password?'
    }
  ]
  return prompt(question)
}
