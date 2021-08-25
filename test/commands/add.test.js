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
    t.equal(code, 0)
    t.equal(ks.data.length, 1)
    t.same(ks.data[0].tags, [])
  })
})

test('import file env', t => {
  t.plan(5)
  const importFile = '.env'
  writeFileSync(importFile, 'HELLO=WORLD\nCIAO=MONDO\nHOLA=MUNDO\n')
  h.createTestKeepyStore()
  const cli = spawn(node, ['cli', 'add', '-f', importFile, '-t', 'from-file', '-w', 'ciao'])
  cli.on('close', (code) => {
    const ks = h.readKeepyStore()
    t.equal(code, 0)
    t.equal(ks.data.length, 3)
    t.equal(ks.data[0].tags.length, 1)
    t.equal(ks.data[1].tags.length, 1)
    t.equal(ks.data[2].tags.length, 1)
  })
})

test('import file json plain', t => {
  t.plan(11)

  const password = 'ciao'
  const importFile = '__test__.json'

  writeFileSync(importFile, '{\n"HELLO":"WORLD",\n"CIAO":"MONDO",\n"HOLA":"MUNDO"\n}\n')
  h.createTestKeepyStore()
  const cli = spawn(node, ['cli', 'add', '-f', importFile, '-t', 'from-file', '-w', password])
  cli.on('close', (code) => {
    const ks = h.readKeepyStore()
    t.equal(code, 0)
    t.equal(ks.data.length, 3)
    t.equal(ks.data[0].tags.length, 1)
    t.equal(ks.data[1].tags.length, 1)
    t.equal(ks.data[2].tags.length, 1)

    t.equal(h.decryptString(ks.data[0].key, password, ks.secure.salt), 'HELLO')
    t.equal(h.decryptString(ks.data[0].payload, password, ks.secure.salt), 'WORLD')
    t.equal(h.decryptString(ks.data[1].key, password, ks.secure.salt), 'CIAO')
    t.equal(h.decryptString(ks.data[1].payload, password, ks.secure.salt), 'MONDO')
    t.equal(h.decryptString(ks.data[2].key, password, ks.secure.salt), 'HOLA')
    t.equal(h.decryptString(ks.data[2].payload, password, ks.secure.salt), 'MUNDO')
  })
})

test('import file json nested', t => {
  t.plan(20)

  const password = 'ciao'
  const importFile = '__test__.json'
  writeFileSync(importFile, `{
    "HELLO": "WORLD",
    "NUM1": 42,
    "NULLED": null,
    "BOOL1": true,
    "ARR1": [1, 2, 3, 4],
    "OBJ1": {
      "nested": 42
    }
  }`)
  h.createTestKeepyStore()
  const cli = spawn(node, ['cli', 'add', '-f', importFile, '-t', 'from-file', '-w', password])
  let logged = ''
  cli.stdout.on('data', (data) => {
    logged += data
  })
  cli.on('close', (code) => {
    const ks = h.readKeepyStore()
    t.match(logged, /.*ARR1.*it's not a primitive, importing as string.*/)
    t.match(logged, /.*OBJ1.*it's not a primitive, importing as string.*/)
    t.equal(code, 0)
    t.equal(ks.data.length, 6)
    t.equal(ks.data[0].tags.length, 1)
    t.equal(ks.data[1].tags.length, 1)
    t.equal(ks.data[2].tags.length, 1)
    t.equal(ks.data[3].tags.length, 1)
    t.equal(ks.data[4].tags.length, 1)
    t.equal(ks.data[5].tags.length, 1)

    t.equal(h.decryptString(ks.data[1].key, password, ks.secure.salt), 'NUM1')
    t.equal(h.decryptString(ks.data[1].payload, password, ks.secure.salt), '42')
    t.equal(h.decryptString(ks.data[2].key, password, ks.secure.salt), 'NULLED')
    t.equal(h.decryptString(ks.data[2].payload, password, ks.secure.salt), 'null')
    t.equal(h.decryptString(ks.data[3].key, password, ks.secure.salt), 'BOOL1')
    t.equal(h.decryptString(ks.data[3].payload, password, ks.secure.salt), 'true')
    t.equal(h.decryptString(ks.data[4].key, password, ks.secure.salt), 'ARR1')
    t.equal(h.decryptString(ks.data[4].payload, password, ks.secure.salt), '[1,2,3,4]')
    t.equal(h.decryptString(ks.data[5].key, password, ks.secure.salt), 'OBJ1')
    t.equal(h.decryptString(ks.data[5].payload, password, ks.secure.salt), '{"nested":42}')
  })
})

test('update imported file env', t => {
  t.plan(7)
  const importFile = '.env'
  writeFileSync(importFile, 'hello=one\nhello3=two\nhello4=three\n')
  h.createTestKeepyStoreWithKeys()
  const cli = spawn(node, ['cli', 'add', '-f', importFile, '-u', '-w', 'ciao'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (data) => {
    t.match(data, /.*Updated 3.*/)
  })
  cli.on('close', (code) => {
    const ks = h.readKeepyStore()
    t.equal(code, 0)
    t.equal(ks.data.length, 4)
    t.not(ks.data[0].payload, 'XIXTTBmVymD1NLlXXKJFdeH7diUjcaK7AIKSDZ6rbqFTDCFba+HnnNIQSv9cMH1AWuu9g70FHOF4BmLWF89q50uQcjKPbWlZOGm54SsGEICCTdHneA==')
    t.equal(ks.data[1].payload, 'ZdHit+d2u4pDKvejNIg27krC26WEZQ3oalSVhqyKSUb0QKl/yR5IYibuB2/nznmT47sdokd+jYY33MZ8DCIDcuW1dpjy1WE+bbp9QbxAEZnHyqa/GQ==')
    t.not(ks.data[2].payload, 'qLYcL3yCif2sFdxqpwRlqiR2ZnPFAaMd2lfjXYynWPviiYTRC5lSKceH29UDEtkMQQ2YliDMO+TX8Oq92F+UBa/v03IqZ+InF5QgZcbgRhDX9/sAbg==')
    t.not(ks.data[3].payload, 'ZaCkkm++dGHo6EAuaDjTFH0+0ObwYSj9wpo5fTzujeNKyEv0rOBVGN7oeEwq5+tq5FhBgxRtTtyikW37+HdSJo5B697J+fEu5eJOdraImymyTsHDWQ==')
  })
})

test('update imported file json plain', t => {
  t.plan(7)
  const importFile = '__test__.json'
  writeFileSync(importFile, '{\n"hello": "one",\n"hello3": "two",\n"hello4": "three"\n}\n')
  h.createTestKeepyStoreWithKeys()
  const cli = spawn(node, ['cli', 'add', '-f', importFile, '-u', '-w', 'ciao'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (data) => {
    t.match(data, /.*Updated 3.*/)
  })
  cli.on('close', (code) => {
    const ks = h.readKeepyStore()
    t.equal(code, 0)
    t.equal(ks.data.length, 4)
    t.not(ks.data[0].payload, 'XIXTTBmVymD1NLlXXKJFdeH7diUjcaK7AIKSDZ6rbqFTDCFba+HnnNIQSv9cMH1AWuu9g70FHOF4BmLWF89q50uQcjKPbWlZOGm54SsGEICCTdHneA==')
    t.equal(ks.data[1].payload, 'ZdHit+d2u4pDKvejNIg27krC26WEZQ3oalSVhqyKSUb0QKl/yR5IYibuB2/nznmT47sdokd+jYY33MZ8DCIDcuW1dpjy1WE+bbp9QbxAEZnHyqa/GQ==')
    t.not(ks.data[2].payload, 'qLYcL3yCif2sFdxqpwRlqiR2ZnPFAaMd2lfjXYynWPviiYTRC5lSKceH29UDEtkMQQ2YliDMO+TX8Oq92F+UBa/v03IqZ+InF5QgZcbgRhDX9/sAbg==')
    t.not(ks.data[3].payload, 'ZaCkkm++dGHo6EAuaDjTFH0+0ObwYSj9wpo5fTzujeNKyEv0rOBVGN7oeEwq5+tq5FhBgxRtTtyikW37+HdSJo5B697J+fEu5eJOdraImymyTsHDWQ==')
  })
})

test('missing keepy-storage', t => {
  t.plan(1)
  const cli = spawn(node, ['cli', 'add', '-k', 'A_KEY', '-p', 'value'])
  cli.on('close', (code) => {
    t.equal(code, 1)
  })
})

test('missing mandatory params', async t => {
  t.plan(4)

  h.createTestKeepyStore()

  const tryParam = (params) => {
    return new Promise(resolve => {
      const cli = spawn(node, ['cli', 'add', ...params])
      cli.on('close', (code) => {
        t.equal(code, 1)
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
    t.equal(code, 0)
    t.equal(ks.data.length, 1)
    t.equal(ks.data[0].tags.length, 2)
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
    t.equal(code, 0)
    t.equal(ks.data.length, 1)
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

  t.equal(ksUpdated.data.length, 1)
  t.equal(ksUpdated.data[0].tags.length, 2)
  t.strictNotSame(ksInserted.data[0], ksUpdated.data[0])
}).catch(threw)

test('update param with key and tags', async t => {
  t.plan(8)

  h.createTestKeepyStore()
  await h.execute('add', ['-k', 'A', '-p', 'value', '-w', 'ciao', '-t', 'hello'])
  const ksA = h.readKeepyStore()
  t.equal(ksA.data.length, 1)

  await h.execute('add', ['-k', 'C', '-p', 'value', '-w', 'ciao', '-t', 'hello'])
  const ksC = h.readKeepyStore()
  t.equal(ksC.data.length, 2)

  // this key is added
  await h.execute('add', ['-k', 'C', '-p', 'value', '-w', 'ciao', '-t', 'hello', 'bye'])
  const ksCC = h.readKeepyStore()
  t.equal(ksCC.data.length, 3)

  await h.execute('add', ['-k', 'C', '-p', 'change', '-w', 'ciao', '-t', 'bye', '-u'])
  const ksUpdated = h.readKeepyStore()
  t.equal(ksUpdated.data.length, 3)

  t.equal(ksCC.data[1].payload, ksUpdated.data[1].payload)
  t.strictNotSame(ksCC.data[2].payload, ksUpdated.data[2].payload)
  t.same(ksCC.data[2].key, ksUpdated.data[2].key)
  t.same(ksCC.data[2].tags, ksUpdated.data[2].tags)
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
  t.equal(ksUpdated.data.length, 0)
}).catch(threw)

test('help', t => {
  t.plan(2)
  const cli = spawn(node, ['cli', 'add', '-h'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (output) => {
    const contentHelp = h.readFileHelp('add')
    t.equal(output, contentHelp)
    t.pass()
  })
})

test('help when wrong params', t => {
  t.plan(2)
  const cli = spawn(node, ['cli', 'add', 'what', 'is', 'this'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (output) => {
    const contentHelp = h.readFileHelp('add')
    t.equal(output, contentHelp)
    t.pass()
  })
})

test('malformed json file', t => {
  t.plan(3)
  const importFile = '__test__.json'
  writeFileSync(importFile, '{\n"not_existing_key": "one"')
  h.createTestKeepyStoreWithKeys()
  const cli = spawn(node, ['cli', 'add', '-f', importFile, '-u', '-w', 'ciao'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (data) => {
    t.match(data, /.*given '__test__.json' is not a valid JSON file.*/)
  })
  cli.on('close', (code) => {
    const ks = h.readKeepyStore()
    t.equal(code, 1)
    t.equal(ks.data.length, 4)
  })
})
