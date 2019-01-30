'use strict'

const { test, threw } = require('tap')
const h = require('../helper')
const { spawn } = require('child_process')
const { writeFileSync } = require('fs')

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

test('import file', t => {
  t.plan(5)
  const importFile = '.env'
  writeFileSync(importFile, `HELLO=WORLD\nCIAO=MONDO\nHOLA=MUNDO\n`)
  h.createTestKeepyStore()
  const cli = spawn(node, ['cli', 'add', '-f', importFile, '-t', 'from-file', '-w', 'ciao'])
  cli.on('close', (code) => {
    const ks = h.readKeepyStore()
    t.equals(code, 0)
    t.equals(ks.data.length, 3)
    t.equals(ks.data[0].tags.length, 1)
    t.equals(ks.data[1].tags.length, 1)
    t.equals(ks.data[2].tags.length, 1)
  })
})

test('update imported file', t => {
  t.plan(7)
  const importFile = '.env'
  writeFileSync(importFile, `hello=one\nhello3=two\nhello4=three\n`)
  h.createTestKeepyStoreWithKeys()
  const cli = spawn(node, ['cli', 'add', '-f', importFile, '-u', '-w', 'ciao'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (data) => {
    t.match(data, /.*Updated 3.*/)
  })
  cli.on('close', (code) => {
    const ks = h.readKeepyStore()
    t.equals(code, 0)
    t.equals(ks.data.length, 4)
    t.notEqual(ks.data[0].payload, 'XIXTTBmVymD1NLlXXKJFdeH7diUjcaK7AIKSDZ6rbqFTDCFba+HnnNIQSv9cMH1AWuu9g70FHOF4BmLWF89q50uQcjKPbWlZOGm54SsGEICCTdHneA==')
    t.equals(ks.data[1].payload, 'ZdHit+d2u4pDKvejNIg27krC26WEZQ3oalSVhqyKSUb0QKl/yR5IYibuB2/nznmT47sdokd+jYY33MZ8DCIDcuW1dpjy1WE+bbp9QbxAEZnHyqa/GQ==')
    t.notEqual(ks.data[2].payload, 'qLYcL3yCif2sFdxqpwRlqiR2ZnPFAaMd2lfjXYynWPviiYTRC5lSKceH29UDEtkMQQ2YliDMO+TX8Oq92F+UBa/v03IqZ+InF5QgZcbgRhDX9/sAbg==')
    t.notEqual(ks.data[3].payload, 'ZaCkkm++dGHo6EAuaDjTFH0+0ObwYSj9wpo5fTzujeNKyEv0rOBVGN7oeEwq5+tq5FhBgxRtTtyikW37+HdSJo5B697J+fEu5eJOdraImymyTsHDWQ==')
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
  t.plan(3)

  h.createTestKeepyStore()

  const executeAdd = (params) => {
    return new Promise(resolve => {
      const cli = spawn(node, ['cli', 'add', ...params])
      cli.stdin.write('ciao\n')
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
}).catch(threw)

test('update param with key and tags', async t => {
  t.plan(8)

  h.createTestKeepyStore()
  await h.execute('add', ['-k', 'A', '-p', 'value', '-w', 'ciao', '-t', 'hello'])
  const ksA = h.readKeepyStore()
  t.equals(ksA.data.length, 1)

  await h.execute('add', ['-k', 'C', '-p', 'value', '-w', 'ciao', '-t', 'hello'])
  const ksC = h.readKeepyStore()
  t.equals(ksC.data.length, 2)

  // this key is added
  await h.execute('add', ['-k', 'C', '-p', 'value', '-w', 'ciao', '-t', 'hello', 'bye'])
  const ksCC = h.readKeepyStore()
  t.equals(ksCC.data.length, 3)

  await h.execute('add', ['-k', 'C', '-p', 'change', '-w', 'ciao', '-t', 'bye', '-u'])
  const ksUpdated = h.readKeepyStore()
  t.equals(ksUpdated.data.length, 3)

  t.equals(ksCC.data[1].payload, ksUpdated.data[1].payload)
  t.deepNot(ksCC.data[2].payload, ksUpdated.data[2].payload)
  t.deepEquals(ksCC.data[2].key, ksUpdated.data[2].key)
  t.deepEquals(ksCC.data[2].tags, ksUpdated.data[2].tags)
}).catch(threw)

test('update unexisting key', async t => {
  t.plan(1)

  h.createTestKeepyStore()

  const executeAdd = (params) => {
    return new Promise(resolve => {
      const cli = spawn(node, ['cli', 'add', ...params])
      cli.stdin.write('ciao\n')
      cli.on('close', resolve)
    })
  }

  await executeAdd(['-k', 'THE_KEY', '-p', 'value', '-u'])
  const ksUpdated = h.readKeepyStore()
  t.equals(ksUpdated.data.length, 0)
}).catch(threw)

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
