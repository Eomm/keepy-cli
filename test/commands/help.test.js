'use strict'

const { test } = require('tap')
const { spawn } = require('child_process')

const h = require('../helper')

const node = process.execPath

test('help', t => {
  t.plan(2)
  const cli = spawn(node, ['cli', 'help'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (output) => {
    const contentHelp = h.readFileHelp('help')
    t.equals(output, contentHelp)
    t.pass()
  })
})

test('help when none params', t => {
  t.plan(2)
  const cli = spawn(node, ['cli'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (output) => {
    const contentHelp = h.readFileHelp('help')
    t.equals(output, contentHelp)
    t.pass()
  })
})
