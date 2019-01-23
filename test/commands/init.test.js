'use strict'

const { test } = require('tap')
const h = require('../helper')
const { spawn } = require('child_process')

const node = process.execPath

test('basic input', async t => {
  t.plan(3)

  const cli = spawn(node, ['cli', 'init'], { stdio: ['pipe', 'pipe', 'ignore'] })

  const hint = 'my personal hint'

  cli.stdin.setEncoding('utf-8')
  cli.stdin.write('password\n')
  await h.wait(1000)
  cli.stdin.write(`${hint}\n`)
  await h.wait(1000)
  cli.stdin.end()

  const ks = h.readKeepyStore()

  // TODO add version check
  t.equals(ks.meta.hint, hint)
  t.contains(ks.secure, { salt: /\w{0,50}/, verify: /\w{0,120}/ })
  t.deepEquals(ks.data, [])
})

test('input cancelled', { skip: true }, t => {
  // TODO: SIGINT when waiting for input from user
})

test('keepy-store already exists', t => {
  t.plan(2)
  h.createFakeKeepyStore()
  const cli = spawn(node, ['cli', 'init'])
  cli.on('close', (code) => {
    t.equals(code, 1)
    t.pass()
  })
})

test('no-input init - overwrite', t => {
  t.plan(2)
  h.createFakeKeepyStore()
  const cli = spawn(node, ['cli', 'init', '-YF'])
  cli.on('close', (code) => {
    t.equals(code, 0)
    t.pass()
  })
})

test('no-input init - password', t => {
  t.plan(2)
  const cli = spawn(node, ['cli', 'init', '-Y', '-w password'])
  cli.on('close', (code) => {
    t.equals(code, 0)
    // TODO check the password applied
    t.pass()
  })
})

test('help', t => {
  t.plan(2)
  const cli = spawn(node, ['cli', 'init', '-h'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (output) => {
    const contentHelp = h.readFileHelp('init')
    t.equals(output, contentHelp)
    t.pass()
  })
})

test('help when wrong params', t => {
  t.plan(2)
  const cli = spawn(node, ['cli', 'init', 'what', 'is', 'this'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (output) => {
    const contentHelp = h.readFileHelp('init')
    t.equals(output, contentHelp)
    t.pass()
  })
})
