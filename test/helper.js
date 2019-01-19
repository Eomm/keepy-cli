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

function readFileHelp (file) {
  const help = fs.readFileSync(`./man/${file}.txt`, 'utf8')
  return `${help}\n` // added because shell add a new line at the end
}

module.exports = {
  wait,
  readKeepyStore,
  createFakeKeepyStore,
  readFileHelp
}
