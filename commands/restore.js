'use strict'

const { Readable } = require('stream')
const { writeToFileStream } = require('file-utils-easy')

const askFor = require('../lib/askFor')
const parseArgs = require('../lib/args')
const log = require('../lib/notify')
const needToShowHelp = require('../lib/help')
const setEnv = require('../lib/setenv')
const CryptoStorage = require('../lib/CryptoStorage')

module.exports = async function (args) {
  let opts = parseArgs(args)
  needToShowHelp('restore.txt', opts)

  if (!opts.key && opts.tags.length === 0) {
    return log.error('❌ key or tags parameter are mandatory', 1)
  }

  const storage = new CryptoStorage()
  try {
    await storage.load()
  } catch (error) {
    log.error(`❌ Error: the keepy-store.json doesn't exists`, 1)
  }

  let password = opts.password || null
  if (storage.isSecured() && password === null) {
    password = await askFor.password(storage.reminder)
  }

  try {
    const filter = {
      key: opts.key,
      tag: opts.tags
    }
    const ksItems = storage.read(password, filter)

    if (opts.stout) {
      printOut(ksItems)
    }

    if (opts.env) {
      printEnv(ksItems)
    }

    if (opts.file) {
      printFile(ksItems, opts.file)
    }
  } catch (error) {
    log.error(`❌ Error: ${error.message}`, 1)
  }
}

const toKeyVal = (k) => `${k.key}=${k.payload}`

function printOut (ksItems) {
  ksItems.map(toKeyVal).forEach(_ => console.log(_))
}

function printEnv (ksItems) {
  ksItems.forEach(_ => setEnv(_.key, _.payload))
}

function printFile (ksItems, filePath) {
  const readable = new Readable()
  writeToFileStream(readable, filePath)
  ksItems.map(toKeyVal).forEach(s => readable.push(`${s}\n`))
  readable.push(null)
}
