'use strict'

const path = require('path')
const { prompt } = require('enquirer')
const { readFileSync } = require('fs')

const parseArgs = require('../lib/args')
const log = require('../lib/log')
const CryptoStorage = require('../lib/CryptoStorage')

module.exports = async function (args) {
  const opts = parseArgs(args)
  if (opts.help) {
    return showHelp()
  }

  const storage = new CryptoStorage()
  const exists = await storage.exists()

  if (!opts.overwrite && exists) {
    log.error('❌ Keepy-store already exists!')
    return
  }

  let initParameter = {
    name: '',
    password: '',
    reminder: ''
  }

  if (opts.yes === true) {
    initParameter.password = storage.randomPassword()
  } else {
    try {
      initParameter = await askParameters()
    } catch (error) {
      log.error('Operation cancelled')
      return
    }
  }

  try {
    storage.init(initParameter)
    await storage.persist()
    log.info(`✨ Created keepy-store.json${opts.yes ? ` with password: ${initParameter.password}` : ''}`)
  } catch (error) {
    log.error(`Saving error: ${error.message}`)
  }
}

function showHelp () {
  console.log(readFileSync(path.join(__dirname, '..', 'man', 'init.txt'), 'utf8'))
}

function askParameters () {
  const question = [
    {
      type: 'input',
      name: 'name',
      message: 'Secure storage name?'
    },
    {
      type: 'password',
      name: 'password',
      message: 'Whant to set a password?'
    },
    {
      type: 'input',
      name: 'reminder',
      message: 'Whould you like to set a reminder for the password?'
    }
  ]
  return prompt(question)
}
