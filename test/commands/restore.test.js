'use strict'

const { test } = require('tap')
const h = require('../helper')
const { spawn } = require('child_process')

const node = process.execPath

test('restore unexisting keystore', t => {
  t.plan(2)
  const cli = spawn(node, ['cli', 'restore', '-k', 'KEY'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (data) => {
    t.match(data, /.*exists.*/)
  })
  cli.on('close', (code) => {
    t.equals(code, 1)
  })
})

test('restore to stdout', { skip: true }, t => {
  // TODO
})

test('restore to env', { skip: true }, async t => {
  // TODO
})

test('restore to file', { skip: true }, async t => {
  // TODO
})

test('restore with key filter', { skip: true }, async t => {
  // TODO
})

test('restore with tag filter', { skip: true }, async t => {
  // TODO
})

test('restore with key and tag filter', { skip: true }, async t => {
  // TODO
})

test('restore unexisting key', { skip: true }, async t => {
  // TODO
})

test('missing mandatory password param', t => {
  t.plan(2)
  const cli = spawn(node, ['cli', 'restore'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (data) => {
    t.match(data, /.*mandatory.*/)
  })
  cli.on('close', (code) => {
    t.equals(code, 1)
  })
})

test('help', t => {
  t.plan(2)
  const cli = spawn(node, ['cli', 'restore', '-h'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (output) => {
    const contentHelp = h.readFileHelp('restore')
    t.equals(output, contentHelp)
    t.pass()
  })
})

test('help when wrong params', t => {
  t.plan(2)
  const cli = spawn(node, ['cli', 'restore', 'what', 'is', 'this'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (output) => {
    const contentHelp = h.readFileHelp('restore')
    t.equals(output, contentHelp)
    t.pass()
  })
})
