'use strict'
const { beforeEach, afterEach } = require('tap')
const fs = require('fs')
const rimraf = require('rimraf')
const { spawn } = require('child_process')

const { KEEPY_STORE } = require('../lib/CryptoStorage')

beforeEach(done => { rimraf('keepy*.json', done) })
afterEach((done) => {
  rimraf.sync('.env')
  rimraf('keepy*.json', done)
})

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
  // TODO should be generated
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

function createTestKeepyStoreWithKeys () {
  // TODO should be generated
  // the password is "ciao"
  // keys: [hello, hello2, hello3, hello4]
  const content = `{
    "meta": {
      "version": "0.0.1",
      "secured": true,
      "hint": "How do you say 'HI' in italian?"
    },
    "secure": {
      "salt": "J3dhrzHfu9PxIA7F+JfxvEbn4tgu4eJqm5I7vvTCmuk=",
      "verify": "LjjbofDoc9S8/3W2VUJfsAlOM4tHWIHd/qMhVAORp0tcW9HndluIrmkXkCAbM/vkWjd6IUWoi6GmzaAO5na06rjFQWj+6D5XGCEMf7CJ9bf7lzrMZKM="
    },
    "data": [
      {
        "key": "kI7oVKxOijkstIBRAFKic7pWz57JpMKLdfx6q+hubaN+++cDp0h5IVxAS0+da+/hiBqmLr/MQrgiVOa6RV9FRex9wQy55dT0X1XOORBp8Q0f3GAiag==",
        "payload": "XIXTTBmVymD1NLlXXKJFdeH7diUjcaK7AIKSDZ6rbqFTDCFba+HnnNIQSv9cMH1AWuu9g70FHOF4BmLWF89q50uQcjKPbWlZOGm54SsGEICCTdHneA==",
        "tags": []
      },
      {
        "key": "kn0YMZZakI3vSVgAIcoSW3TUweO6flBb99GgRfpzqd7+0PvviafGX0f5fhvsQTFlAsSE+OreF8Y58JIfQrYzZ1959DtuZIPihOuT4bFQFjjHFyv7yvU=",
        "payload": "ZdHit+d2u4pDKvejNIg27krC26WEZQ3oalSVhqyKSUb0QKl/yR5IYibuB2/nznmT47sdokd+jYY33MZ8DCIDcuW1dpjy1WE+bbp9QbxAEZnHyqa/GQ==",
        "tags": []
      },
      {
        "key": "lXPQGTJCyH57pXu2S4PhfkHacsMWsHZVBsr3+mFK0iDzOYILrVH4kBtx1RsWVPxo4PegJoBVykamWHzRVPqLfeZrbd5FkACuqFWSf8C50LaWdgf6L0s=",
        "payload": "qLYcL3yCif2sFdxqpwRlqiR2ZnPFAaMd2lfjXYynWPviiYTRC5lSKceH29UDEtkMQQ2YliDMO+TX8Oq92F+UBa/v03IqZ+InF5QgZcbgRhDX9/sAbg==",
        "tags": [
          "wtg2J3HW4xBQFOm95cqe1kySWJkoGCo/UgF3peMXFbwAAjWU6y/8r/GXSRoODehD7hnZkYAJKAThQauZMr9OaOqCBY3bCxYdoJhBJ75zHiF1xVJJCw=="
        ]
      },
      {
        "key": "v/q6Bhj8WbwMt9PlmIsTWpgRPNlau9w5qmJUvYla3fReLWIIHegGxrNykq5TtB2Kw0u+yfhk6MmRYo52//i3mXScnnQgO8p4Pr/4TX0CAKZ7Ked09ls=",
        "payload": "ZaCkkm++dGHo6EAuaDjTFH0+0ObwYSj9wpo5fTzujeNKyEv0rOBVGN7oeEwq5+tq5FhBgxRtTtyikW37+HdSJo5B697J+fEu5eJOdraImymyTsHDWQ==",
        "tags": [
          "MEIEirCezaZF5ek3RH96rcjx6GANy0DF0IzUuVuCtfrhxfCaSWP1RWNESnh1w0D9HU0uBA+3ncercPjJlcVi6M49qSCucb7IwXtdR7o81BOvK/nfeg=="
        ]
      }
    ]
  }`
  fs.writeFileSync(KEEPY_STORE, content)
}

function readFileHelp (file) {
  const help = fs.readFileSync(`./man/${file}.txt`, 'utf8')
  return `${help}\n` // added because shell add a new line at the end
}

function execute (command, params, cb) {
  const node = process.execPath
  return new Promise(resolve => {
    const cli = spawn(node, ['cli', command, ...params])
    cli.on('close', resolve)
    if (cb) {
      cb(cli)
    }
  })
}

module.exports = {
  wait,
  readKeepyStore,
  createFakeKeepyStore,
  createTestKeepyStore,
  createTestKeepyStoreWithKeys,
  readFileHelp,
  execute
}
