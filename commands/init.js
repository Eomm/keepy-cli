'use strict'

const path = require('path')
const { prompt } = require('enquirer')
const { readFileSync } = require('fs')

const parseArgs = require('../lib/args')
const CryptoStorage = require('../lib/CryptoStorage')

module.exports = async function (args) {
  const opts = parseArgs(args)
  if (opts.help) {
    return showHelp()
  }

  let initParameter = {
    name: '',
    password: '',
    reminder: ''
  }

  if (opts.yes !== true) {
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

    initParameter = await prompt(question)
    console.log(initParameter)
  }

  const storage = new CryptoStorage()
  storage.init(initParameter)
  storage.persist()
}

function showHelp () {
  console.log(readFileSync(path.join(__dirname, '..', 'man', 'init.txt'), 'utf8'))
}
