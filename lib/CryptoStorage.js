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

  store (password, keyValue, payload, labels = []) {
    if (!this.isSecured()) {
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

  refresh (indexes, password, payload) {
    const key = this.checkPassword(password)
    const payloadEncripted = this.crypto.encrypt(payload, key)
    const pe = payloadEncripted.toString('base64')

    indexes.forEach(i => {
      this.storage.data[i].payload = pe
    })
    clearBuffer(key)
  }

  readAll (password) {
    if (!this.isSecured()) {
      return this.storage.data
    }
    const key = this.checkPassword(password)
    const clearData = this._decryptData(key)
    clearBuffer(key)
    return clearData
  }

  read (password, filter) {
    const data = this.readAll(password)

    const addIndex = (ds, i) => { ds.index = i; return ds }
    const filterKey = ds => filter.key ? (ds.key === filter.key) : true
    const filterTag = ds => filter.tags.reduce((bool, tag) => bool && ds.tags.includes(tag), true)

    return data
      .map(addIndex)
      .filter(filterKey)
      .filter(filterTag)
  }

  erase (password, filter) {
    const data = this.readAll(password)

    const addIndex = (ds, i) => { ds.index = i; return ds }
    const toIndex = (ds) => ds.index
    const filterKey = ds => filter.key ? (ds.key === filter.key) : true
    const filterTag = ds => filter.tags.reduce((bool, tag) => bool && ds.tags.includes(tag), true)
    const ignoreIndex = (ignoreList) => (ds, i) => !ignoreList.includes(i)

    const deleteItems = data
      .map(addIndex)
      .filter(filterKey)
      .filter(filterTag)
      .map(toIndex)

    this.storage.data = this.storage.data.filter(ignoreIndex(deleteItems))
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

  _decryptData (keyOfDatastore) {
    // TODO decrypt only what is needed and not all the store
    // ! decrypt only keys&tag needed instead of all keys and payload
    return this.storage.data.map(keyValue => {
      const k = this.crypto.decrypt(Buffer.from(keyValue.key, 'base64'), keyOfDatastore)
      const key = k.toString('utf8')

      const p = this.crypto.decrypt(Buffer.from(keyValue.payload, 'base64'), keyOfDatastore)
      const payload = p.toString('utf8')

      const tags = keyValue.tags.map(t => this.crypto.decrypt(Buffer.from(t, 'base64'), keyOfDatastore).toString('utf8'))

      clearBuffer(k)
      clearBuffer(p)

      return { key, payload, tags }
    })
  }
}

function clearBuffer (buffer) {
  buffer.fill(0)
}

module.exports = CryptoStorage
module.exports.KEEPY_STORE = FILENAME
