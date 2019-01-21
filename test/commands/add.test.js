'use strict'

const { test, threw } = require('tap')
const h = require('../helper')
const { spawn } = require('child_process')

const node = process.execPath

test('right usage', t => {
  t.plan(3)

  h.createTestKeepyStore()
  const cli = spawn(node, ['cli', 'add', '-k', 'A_KEY', '-p', 'value', '-w', 'ciao'])

  cli.on('close', (code) => {
    const ks = h.readKeepyStore()
    t.equals(code, 0)
    t.equals(ks.data.length, 1)
    t.deepEquals(ks.data[0].tags, [])
  })
})

test('missing keepy-storage', t => {
  t.plan(1)
  const cli = spawn(node, ['cli', 'add', '-k', 'A_KEY', '-p', 'value'])
  cli.on('close', (code) => {
    t.equals(code, 1)
  })
})

test('missing mandatory params', async t => {
  t.plan(4)

  h.createTestKeepyStore()

  const tryParam = (params) => {
    return new Promise(resolve => {
      const cli = spawn(node, ['cli', 'add', ...params])
      cli.on('close', (code) => {
        t.equals(code, 1)
        resolve()
      })
    })
  }

  await tryParam(['-k'])
  await tryParam(['-k', 'value'])
  await tryParam(['-k', 'value', '-p'])
  await tryParam(['-k', 'value', '-e'])
})

test('input password and tags', t => {
  t.plan(3)

  h.createTestKeepyStore()
  const cli = spawn(node, ['cli', 'add', '-k', 'THE_KEY', '-p', 'value', '-t', 'hello', 'world'])
  cli.on('close', (code) => {
    const ks = h.readKeepyStore()
    t.equals(code, 0)
    t.equals(ks.data.length, 1)
    t.equals(ks.data[0].tags.length, 2)
  })

  cli.stdin.setEncoding('utf-8')
  cli.stdin.write('ciao\n')
  cli.stdin.end()
})

test('env param', t => {
  t.plan(2)

  h.createTestKeepyStore()
  const env = { THE_KEY: 'the value' }
  const cli = spawn(node, ['cli', 'add', '-k', 'THE_KEY', '-p', '-e', '-w', 'ciao'], { env })
  cli.on('close', (code) => {
    const ks = h.readKeepyStore()
    t.equals(code, 0)
    t.equals(ks.data.length, 1)
  })
})

test('update param with key', async t => {
  t.plan(4)

  h.createTestKeepyStore()

  const executeAdd = (params) => {
    return new Promise(resolve => {
      const cli = spawn(node, ['cli', 'add', ...params])
      cli.on('close', resolve)
    })
  }

  await executeAdd(['-k', 'THE_KEY', '-p', 'value', '-t', 'hello', 'world'])
  const ksInserted = h.readKeepyStore()
  await executeAdd(['-k', 'THE_KEY', '-p', 'newValue', '-u'])
  const ksUpdated = h.readKeepyStore()

  t.equals(ksUpdated.data.length, 1)
  t.equals(ksUpdated.data[0].tags.length, 2)
  t.deepNot(ksInserted.data[0], ksUpdated.data[0])
  t.end()
}).catch(threw)

test('update param with tags', { skip: true }, t => {
  // TODO
})

test('update param with key and tags', { skip: true }, t => {
  // TODO
})

test('update unexisting key', { skip: true }, t => {
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
