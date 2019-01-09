'use script'

const fue = require('file-utils-easy')
const CryptoString = require('../lib/CryptoString')

const FILENAME = 'keepy-store.json'

const VERIFY = 'verify'

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

  get verify () {
    return this.storage.secure.verify
  }

  get reminder () {
    return this.storage.meta.reminder
  }

  init (meta) {
    const salt = this.crypto.getSalt().toString('base64')

    const secured = !!meta.password

    let verify = VERIFY
    if (secured) {
      const k = this.crypto.getKeyFromPassword(Buffer.from(meta.password), Buffer.from(salt, 'base64'))
      verify = this.crypto.encrypt(verify, k).toString('base64')
      clearBuffer(k)
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

  store (password, keyValue, payload, labels) {
    if (password === null) {
      this.storage.data[keyValue] = {
        payload,
        labels
      }
      return
    }

    const key = this.checkPassword(password)

    const keyEncripted = this.crypto.encrypt(keyValue, key)
    const payloadEncripted = this.crypto.encrypt(payload, key)
    const labelsEncripted = labels.map(l => this.crypto.encrypt(l, key).toString('base64'))
    this.storage.data[keyEncripted.toString('base64')] = {
      payload: payloadEncripted.toString('base64'),
      labels: labelsEncripted
    }

    clearBuffer(key)
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

  checkPassword (password) {
    const key = this.crypto.getKeyFromPassword(Buffer.from(password), Buffer.from(this.salt, 'base64'))
    try {
      const checkPass = this.crypto.decrypt(Buffer.from(this.verify, 'base64'), key)
      if (checkPass.toString('utf8') !== VERIFY) {
        throw new Error('Wrong Password!')
      }
      clearBuffer(checkPass)
      return key
    } catch (error) {
      throw new Error('Wrong Password!')
    }
  }
}

function clearBuffer (buffer) {
  buffer.fill(0)
}

module.exports = CryptoStorage
