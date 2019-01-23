'use strict'

const { Readable } = require('stream')
const { writeToFileStream, existFile } = require('file-utils-easy')

const askFor = require('../lib/askFor')
const parseArgs = require('../lib/args')
const log = require('../lib/notify')
const needToShowHelp = require('../lib/help')
const setEnv = require('../lib/setenv')
const CryptoStorage = require('../lib/CryptoStorage')

module.exports = async function (args) {
  let opts = parseArgs(args)
  needToShowHelp('restore.txt', opts)

  const showAll = !opts.key && opts.tags.length === 0

  // if none output, set stdout
  if (!opts.stout && !opts.env && !opts.file) {
    opts.stout = true
  }

  if (!opts.overwrite && opts.file) {
    try {
      await existFile(opts.file)
      log.error(`❌ Error: the file ${opts.file} already exists. Overwrite with -F`, 1)
    } catch (err) { /* the file doesn't esists */ }
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
    let ksItems
    if (showAll) {
      ksItems = storage.readAll(password)
    } else {
      const filter = {
        key: opts.key,
        tags: opts.tags
      }
      ksItems = storage.read(password, filter)
    }

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
