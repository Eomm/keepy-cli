'use strict'

const { prompt } = require('enquirer')

const parseArgs = require('../lib/args')
const CryptoStorage = require('../lib/CryptoStorage')

module.exports = async function (args) {
  let opts = parseArgs(args)
  console.log(opts)

  // const ciphers = crypto.getCiphers();
  // console.log(ciphers);

  // ASK for password

  const storage = new CryptoStorage()
  await storage.load()

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
    console.log('Added')
  } catch (error) {
    console.log(error.message)
  }
}
