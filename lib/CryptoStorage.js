'use script'

const fue = require('file-utils-easy')
const CryptoString = require('../lib/CryptoString')

const FILENAME = 'keepy-store.json'

class CryptoStorage {
  constructor () {
    // the path to the storage
    this.storage = {}
    this.fileName = FILENAME
    this.crypto = new CryptoString()
  }

  isSecured () {
    return this.storage.meta.secured
  }

  get salt () {
    return this.storage.secure.salt
  }

  init (meta) {
    const salt = this.crypto.getSalt().toString('base64')

    const secured = !!meta.password

    let verify = 'verify'
    if (secured) {
      const k = this.crypto.getKeyFromPassword(Buffer.from(meta.password), Buffer.from(salt, 'base64'))
      verify = this.crypto.encrypt(verify, k).toString('base64')
    }

    this.storage = {
      meta: {
        name: meta.name,
        secured,
        reminder: meta.reminder
      },
      secure: {
        salt,
        verify
      },
      data: {}
    }
  }

  async load () {
    this.storage = await fue.readJsonFile(this.fileName)
  }

  store (password, key, payload, labels) {
    if (password === null) {
      this.storage.data[key] = {
        payload,
        labels
      }
      return
    }

    const k = this.crypto.getKeyFromPassword(Buffer.from(password), Buffer.from(this.salt, 'base64'))

    const keyEncripted = this.crypto.encrypt(key, k)
    const payloadEncripted = this.crypto.encrypt(payload, k)
    const labelsEncripted = labels.map(l => this.crypto.encrypt(l, k).toString('base64'))
    this.storage.data[keyEncripted.toString('base64')] = {
      payload: payloadEncripted.toString('base64'),
      labels: labelsEncripted
    }
  }

  read (password) {
    // TODO read from the secure storage
  }

  remove (key, options) {
    // TODO
  }

  persist () {
    return fue.writeToFile(JSON.stringify(this.storage, null, 2), this.fileName)
  }
}

module.exports = CryptoStorage
