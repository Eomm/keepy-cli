'use strict'

const { test } = require('tap')
const h = require('../helper')
const { spawn } = require('child_process')

const node = process.execPath

test('delete key', t => {
  t.plan(2)
  h.createTestKeepyStoreWithKeys()
  const cli = spawn(node, ['cli', 'delete', '-k', 'hello', '-w', 'ciao'])
  cli.on('close', (code) => {
    const ks = h.readKeepyStore()
    t.equals(code, 0)
    t.equals(ks.data.length, 3)
  })
})

test('delete unexisting key', t => {
  t.plan(2)
  h.createTestKeepyStoreWithKeys()
  const cli = spawn(node, ['cli', 'delete', '-k', 'DOESNTEXISTS'])
  cli.on('close', (code) => {
    const ks = h.readKeepyStore()
    t.equals(code, 0)
    t.equals(ks.data.length, 4)
  })
  cli.stdin.setEncoding('utf-8')
  cli.stdin.write('ciao\n')
  cli.stdin.end()
})

test('delete by tag', t => {
  t.plan(2)
  h.createTestKeepyStoreWithKeys()
  const cli = spawn(node, ['cli', 'delete', '-t', 'alone', '-w', 'ciao'])
  cli.on('close', (code) => {
    const ks = h.readKeepyStore()
    t.equals(code, 0)
    t.equals(ks.data.length, 2)
  })
})

test('delete by key and tag', t => {
  t.plan(2)
  h.createTestKeepyStoreWithKeys()
  const cli = spawn(node, ['cli', 'delete', '-k', 'hello3', '-t', 'alone', '-w', 'ciao'])
  cli.on('close', (code) => {
    const ks = h.readKeepyStore()
    t.equals(code, 0)
    t.equals(ks.data.length, 3)
  })
})

test('delete unexisting file', t => {
  t.plan(2)
  const cli = spawn(node, ['cli', 'delete', '-k', 'bye'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (data) => {
    t.match(data, /doesn't exists/gm)
  })
  cli.on('close', (code) => {
    t.equals(code, 1)
  })
})

test('delete with missing parameters', t => {
  t.plan(2)
  const cli = spawn(node, ['cli', 'delete'])
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
  const cli = spawn(node, ['cli', 'delete', '-h'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (output) => {
    const contentHelp = h.readFileHelp('delete')
    t.equals(output, contentHelp)
    t.pass()
  })
})

test('help when wrong params', t => {
  t.plan(3)
  const cli = spawn(node, ['cli', 'delete', 'what', 'is', 'this'])
  let output = ''
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (data) => { output += data })
  cli.on('close', (code) => {
    const contentHelp = h.readFileHelp('delete')
    t.equals(code, 0)
    t.equals(output, contentHelp)
    t.pass()
  })
})
