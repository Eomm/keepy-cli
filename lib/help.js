'use strict'

const path = require('path')
const { readFileSync, promises: { readFile } } = require('fs')
const { readJsonFile } = require('file-utils-easy')
const dotenv = require('dotenv')
const log = require('./notify')

function needToShowHelp (file, opts) {
  if (opts.help || opts._.length > 0) {
    console.log(readFileSync(path.join(__dirname, '..', 'man', file), 'utf8'))
    process.exit()
  }
}

async function readKeyValueFile (file) {
  const content = await readFile(file, { encoding: 'utf8' })
  const kv = dotenv.parse(content)
  return Object.entries(kv)
}

async function readKeyValueJsonFile (file) {
  const kv = []
  const content = await readJsonFile(file)
  for (const [key, value] of Object.entries(content)) {
    if (typeof value === 'object' && value !== null) {
      log.warn(`❕key=[${key}] it's not a primitive, importing as string`)
    }
    kv.push([key, typeof value === 'string' ? value : JSON.stringify(value)])
  }
  return kv
}

async function extractPayloadFromFile (file) {
  try {
    // Try to read as JSON in any case
    return await readKeyValueJsonFile(file)
  } catch (error) {
    if (error instanceof SyntaxError) {
      // If the extension was explicit but the JSON if malformed, it's be better to raise an error and return
      if (file.trim().endsWith('.json')) {
        return log.error(`❌ given '${file}' is not a valid JSON file`, 1)
      }
      // Eventually try to read as key-value file
      return await readKeyValueFile(file)
    }
    return log.error(`❌ unexpected error: ${error.message}\n${error.stack}`, 1)
  }
}

module.exports = {
  needToShowHelp,
  readKeyValueFile,
  readKeyValueJsonFile,
  extractPayloadFromFile
}
