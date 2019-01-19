'use strict'

const { test } = require('tap')
const h = require('../helper')
const { spawn } = require('child_process')

const node = process.execPath

test('right usage', { skip: true }, async t => {
  // TODO
})

test('missing mandatory params', { skip: true }, async t => {
  // TODO
})

test('no-input', { skip: true }, async t => {
  // TODO
})

test('env param', { skip: true }, async t => {
  // TODO
})

test('env param missing', { skip: true }, async t => {
  // TODO
})

test('update param', { skip: true }, async t => {
  // TODO
})

test('update unexisting key', { skip: true }, async t => {
  // TODO
})

test('help', t => {
  t.plan(2)
  const cli = spawn(node, ['cli', 'add', '-h'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (output) => {
    const contentHelp = h.readFileHelp('add')
    t.equals(output, contentHelp)
    t.pass()
  })
})

test('help when wrong params', t => {
  t.plan(2)
  const cli = spawn(node, ['cli', 'add', 'what', 'is', 'this'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (output) => {
    const contentHelp = h.readFileHelp('add')
    t.equals(output, contentHelp)
    t.pass()
  })
})
