'use strict'

const { test } = require('tap')
const h = require('../helper')
const spawn = require('child_process').spawn

const node = process.execPath

test('basic input', async t => {
  t.plan(3)

  const cli = spawn(node, ['cli', 'init'], { stdio: ['pipe', 'pipe', 'ignore'] })
  // cli.stdout.pipe(process.stdout)

  const hint = 'my personal hint'

  cli.stdin.setEncoding('utf-8')
  cli.stdin.write('password\n')
  await h.wait(1000)
  cli.stdin.write(`${hint}\n`)
  await h.wait(1000)
  cli.stdin.end()

  const ks = h.readKeepyStore()

  t.equals(ks.meta.hint, hint)
  t.contains(ks.secure, { salt: /\w{0,50}/, verify: /\w{0,120}/ })
  t.deepEquals(ks.data, [])
})

test('keepy-store already exists', async (t) => {
  t.plan(1)
  h.createFakeKeepyStore()
  const cli = spawn(node, ['cli', 'init'], { stdio: ['pipe', 'pipe', 'ignore'] })
  // cli.stdout.pipe(process.stdout)
  cli.on('error', () => {
    t.pass()
  })
})
