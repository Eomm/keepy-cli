'use strict'
const { beforeEach, afterEach } = require('tap')
const fs = require('fs')
const rimraf = require('rimraf')

const { KEEPY_STORE } = require('../lib/CryptoStorage')

beforeEach(done => { rimraf('keepy*.json', done) })
afterEach((done) => { rimraf('keepy*.json', done) })

function wait (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function readKeepyStore () {
  return JSON.parse(fs.readFileSync(KEEPY_STORE))
}

function createFakeKeepyStore () {
  fs.writeFileSync(KEEPY_STORE, 'fake')
}

function createTestKeepyStore () {
  // the password is "ciao"
  const content = `{
    "meta": {
      "version": "0.0.1",
      "secured": true,
      "hint": "How do you say 'HI' in italian?"
    },
    "secure": {
      "salt": "TDMszecMqEeSdG7afRqT/nxZK1y099u2/jPqY0nq43o=",
      "verify": "PtIQOl1bx6NRyCtzz2ziRjdfQmMzj9f4AyTwHysH6+QhTZTNUTtFphQEn3aGayqRBZa1ttzst0z+bTCEkL1NdtevN6ZCbu+wO0agfV37d1kWl6rN9MY="
    },
    "data": []
  }`
  fs.writeFileSync(KEEPY_STORE, content)
}

function readFileHelp (file) {
  const help = fs.readFileSync(`./man/${file}.txt`, 'utf8')
  return `${help}\n` // added because shell add a new line at the end
}

module.exports = {
  wait,
  readKeepyStore,
  createFakeKeepyStore,
  createTestKeepyStore,
  readFileHelp
}
