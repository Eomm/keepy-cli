'use strict'

const { prompt } = require('enquirer')
const { Readable } = require('stream')
const { writeToFileStream } = require('file-utils-easy')

const parseArgs = require('../lib/args')
const needToShowHelp = require('../lib/help')
const setEnv = require('../lib/setenv')
const CryptoStorage = require('../lib/CryptoStorage')

module.exports = async function (args) {
  let opts = parseArgs(args)
  needToShowHelp('restore.txt', opts)

  // TODO

  const storage = new CryptoStorage()
  await storage.load()

  let password = null
  if (storage.isSecured() && !opts.password) {
    const question = {
      type: 'password',
      name: 'password',
      message: `Input password -${storage.reminder}-`
    }
    password = (await prompt(question)).password
  }

  try {
    const filter = {
      key: 'k',
      tag: 'l1'
    }

    const keys = storage.read(password || opts.password, filter)

    printOut(keys)
    printFile(keys, 'demo.env')

    printEnv(keys)
  } catch (error) {
    console.log(error.message)
  }
}

const toKeyVal = (k) => `${k.key}=${k.payload}`

function printOut (keys) {
  keys.map(toKeyVal).forEach(_ => console.log(_))
}

function printEnv (keys) {
  keys.forEach(_ => setEnv(_.key, _.payload))
}

function printFile (keys, filePath) {
  const readable = new Readable()
  writeToFileStream(readable, filePath)
  keys.map(toKeyVal).forEach(s => readable.push(`${s}\n`))
  readable.push(null)
}
