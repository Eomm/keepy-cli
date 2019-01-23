'use strict'

const { test } = require('tap')
const { spawn } = require('child_process')

const node = process.execPath

test('right usage', t => {
  t.plan(2)
  const cli = spawn(node, ['cli', 'version'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (data) => {
    t.match(data, /keepy v\d{1,2}\.\d{1,2}\.\d{1,2}/)
  })
  cli.on('close', (code) => {
    t.equals(code, 0)
  })
})

// TODO add "-v" parameter!
