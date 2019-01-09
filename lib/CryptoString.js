const crypto = require('crypto')

const crytpoSettings = require('../settings.json')

class CryptoString {
  constructor () {
    this.config = { ...(crytpoSettings.encryption) }
  }

  getIV () {
    return crypto.randomBytes(this.config.ivByteLen)
  }

  getRandomKey () {
    return crypto.randomBytes(this.config.keyByteLen)
  }

  getSalt () {
    return crypto.randomBytes(this.config.saltByteLen)
  }

  getKeyFromPassword (password, salt) {
    return crypto.scryptSync(password, salt || this.getSalt(), this.config.keyByteLen)
  }

  encrypt (messagetext, key) {
    const iv = this.getIV()
    const cipher = crypto.createCipheriv(this.config.algorithm, key, iv, { 'authTagLength': this.config.authTagByteLen })
    let encryptedMessage = cipher.update(messagetext)
    encryptedMessage = Buffer.concat([encryptedMessage, cipher.final()])
    return Buffer.concat([iv, encryptedMessage, cipher.getAuthTag()])
  }

  decrypt (ciphertext, key) {
    const authTag = ciphertext.slice(-this.config.authTagByteLen)
    const iv = ciphertext.slice(0, this.config.ivByteLen)
    const encryptedMessage = ciphertext.slice(this.config.ivByteLen, -this.config.authTagByteLen)
    const decipher = crypto.createDecipheriv(
      this.config.algorithm, key, iv, { 'authTagLength': this.config.authTagByteLen })
    decipher.setAuthTag(authTag)
    const messagetext = decipher.update(encryptedMessage)
    decipher.final()
    return messagetext
  }
}

module.exports = CryptoString
