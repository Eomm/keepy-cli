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

  randomPassword () {
    return this.crypto.getRandomKey().toString('base64')
  }

  init (meta) {
    const salt = this.crypto.genSalt().toString('base64')

    const secured = !!meta.password

    let verify = VERIFY
    if (secured) {
      const k = this.crypto.getKeyFromPassword(Buffer.from(meta.password), Buffer.from(salt, 'base64'))
      verify = this.crypto.encrypt(verify, k).toString('base64')
      clearBuffer(k)
    }

    this.storage = {
      meta: {
        version: meta.version,
        secured,
        hint: meta.hint
      },
      secure: {
        salt,
        verify
      },
      data: []
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

    this.storage.data.push(
      {
        key: keyEncripted.toString('base64'),
        payload: payloadEncripted.toString('base64'),
        tags: labelsEncripted
      }
    )

    clearBuffer(key)
  }

  readAll (password) {
    if (password === null) {
      return this.storage.data
    }

    const key = this.checkPassword(password)

    Object.keys(this.storage.data)
      .map(keyValue => {
        const data = this.storage.data[keyValue]
        const k = this.crypto.decrypt(Buffer.from(keyValue, 'base64'), key)
        const p = this.crypto.decrypt(Buffer.from(data.payload, 'base64'), key)
        const l = data.labels.map(ll => this.crypto.decrypt(Buffer.from(ll, 'base64'), key).toString('utf8'))
        console.log(k.toString('utf8'))
        console.log(p.toString('utf8'))
        console.log(l)

        clearBuffer(k)
        clearBuffer(p)
      })

    clearBuffer(key)
  }

  read (password, filter) {
    const key = this.checkPassword(password)
    // TODO read from the secure storage

    const clearData = this._decryptData(key)

    // console.log(clearData)

    clearBuffer(key)
    return clearData
  }

  remove (keyValue, options) {
    // TODO
  }

  async exists () {
    let exist = false
    try {
      await fue.existFile(this.fileName)
      exist = true
    } catch (error) {
      // ok if the file doesn't exists
    }
    return exist
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

  _decryptData (key) {
    return this.storage.data.map(keyValue => {
      const k = this.crypto.decrypt(Buffer.from(keyValue.key, 'base64'), key)
      const p = this.crypto.decrypt(Buffer.from(keyValue.payload, 'base64'), key)
      const l = keyValue.tags.map(ll => this.crypto.decrypt(Buffer.from(ll, 'base64'), key).toString('utf8'))
      // clearBuffer(k)
      // clearBuffer(p)
      return {
        key: k.toString('utf8'),
        payload: p.toString('utf8'),
        tags: l
      }
    })
  }
}

function clearBuffer (buffer) {
  buffer.fill(0)
}

module.exports = CryptoStorage
