'use strict'

const { test } = require('tap')
const { readFileSync, writeFileSync } = require('fs')
const h = require('../helper')
const { spawn } = require('child_process')
const chalk = require('chalk')

const node = process.execPath

function escapeRegExp (string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const color = (text, type, enabled) => {
  const colors = {
    label: chalk.red.bold,
    tags: chalk.yellow
  }
  if (!enabled || !colors[type]) return text
  return colors[type](text)
}

test('restore unexisting keystore', t => {
  t.plan(2)
  const cli = spawn(node, ['cli', 'restore', '-k', 'KEY'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (data) => {
    t.match(data, /.*exists.*/)
  })
  cli.on('close', (code) => {
    t.equal(code, 1)
  })
})

test('restore to stdout', t => {
  t.plan(2)
  h.createTestKeepyStoreWithKeys()
  const cli = spawn(node, ['cli', 'restore', '-s', '-w', 'ciao'])
  cli.stdout.setEncoding('utf8')
  let stdout = ''
  cli.stdout.on('data', (data) => {
    stdout += data
  })
  cli.on('close', (code) => {
    t.match(stdout, /^hello.{0,1}=world$/gm)
    t.equal(code, 0)
  })
})

test('restore to stdout colored', t => {
  t.plan(2)
  h.createTestKeepyStoreWithKeys()
  const cli = spawn(node, ['cli', 'restore', '-c', '-s', '-g', '-w', 'ciao'])
  cli.stdout.setEncoding('utf8')
  let stdout = ''
  cli.stdout.on('data', (data) => {
    stdout += data
  })
  cli.on('close', (code) => {
    const label = escapeRegExp(color('hello3=', 'label', true))
    const tags = escapeRegExp(color(' [alone]', 'tags', true))
    const re = new RegExp(`^${label}.{0,1}world${tags}$`, 'gm')
    t.match(stdout, re)
    t.equal(code, 0)
  })
})

test('restore to stdout with tags', t => {
  t.plan(2)
  h.createTestKeepyStoreWithKeys()
  const cli = spawn(node, ['cli', 'restore', '-sg', '-w', 'ciao'])
  cli.stdout.setEncoding('utf8')
  let stdout = ''
  cli.stdout.on('data', (data) => {
    stdout += data
  })
  cli.on('close', (code) => {
    t.match(stdout, /^hello.{0,1}=world \[.*\]$/gm)
    t.equal(code, 0)
  })
})

test('restore wrong password', t => {
  t.plan(2)
  h.createTestKeepyStoreWithKeys()
  const cli = spawn(node, ['cli', 'restore', '-s', '-w', 'wrong'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (data) => {
    t.match(data, /.*Wrong.*$/gm)
  })
  cli.on('close', (code) => {
    t.equal(code, 1)
  })
})

test('restore to stdout as default', t => {
  t.plan(2)
  h.createTestKeepyStoreWithKeys()
  const cli = spawn(node, ['cli', 'restore', '-w', 'ciao'])
  cli.stdout.setEncoding('utf8')
  let stdout = ''
  cli.stdout.on('data', (data) => {
    stdout += data
  })
  cli.on('close', (code) => {
    t.match(stdout, /^hello.{0,1}=world$/gm)
    t.equal(code, 0)
  })
})

test('restore to env', t => {
  t.plan(1)
  h.createTestKeepyStoreWithKeys()
  const cli = spawn(node, ['cli', 'restore', '-e'])
  cli.on('close', (code) => {
    t.equal(code, 0)

    // ! works only after a reboot of the console on windows
    // const checkEnvVar = spawn(node, ['cli', 'add', '-k', 'hello2', '-e', '-w', 'ciao'])
    // checkEnvVar.stdout.pipe(process.stdout)
    // checkEnvVar.on('close', (code) => {
    //   t.equal(code, 0)
    // })
  })
  cli.stdin.setEncoding('utf-8')
  cli.stdin.write('ciao\n')
  cli.stdin.end()
})

test('restore to file', t => {
  t.plan(2)
  h.createTestKeepyStoreWithKeys()
  const outFile = '.env'
  const cli = spawn(node, ['cli', 'restore', '-f', outFile, '-w', 'ciao'])
  cli.stdout.on('data', () => { t.fail() })
  cli.on('close', (code) => {
    t.equal(code, 0)
    const file = readFileSync(outFile)
    t.match(file, /^hello.{0,1}=world$/gm)
  })
})

test('restore to existing file', t => {
  t.plan(2)
  h.createTestKeepyStoreWithKeys()
  const outFile = '.env'
  writeFileSync(outFile, 'fake')
  const cli = spawn(node, ['cli', 'restore', '-f', outFile, '-w', 'ciao'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (data) => {
    t.match(data, /already exists/gm)
  })
  cli.on('close', (code) => {
    t.equal(code, 1)
  })
})

test('restore overwriting existing file', t => {
  t.plan(2)
  h.createTestKeepyStoreWithKeys()
  const outFile = '.env'
  writeFileSync(outFile, 'fake')
  const cli = spawn(node, ['cli', 'restore', '-f', outFile, '-F', '-w', 'ciao'])
  cli.stdout.on('data', () => { t.fail() })
  cli.on('close', (code) => {
    t.equal(code, 0)
    const file = readFileSync(outFile)
    t.match(file, /^hello.{0,1}=world$/gm)
  })
})

test('restore with key filter', t => {
  t.plan(2)
  h.createTestKeepyStoreWithKeys()
  const cli = spawn(node, ['cli', 'restore', '-k', 'hello2', '-w', 'ciao'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (data) => {
    t.equal(data, 'hello2=world\n')
  })
  cli.on('close', (code) => {
    t.equal(code, 0)
  })
})

test('restore with tag filter', t => {
  t.plan(3)
  h.createTestKeepyStoreWithKeys()
  const cli = spawn(node, ['cli', 'restore', '-t', 'alone', '-w', 'ciao'])
  cli.stdout.setEncoding('utf8')
  let stdout = ''
  cli.stdout.on('data', (data) => {
    stdout += data
  })
  cli.on('close', (code) => {
    t.equal(code, 0)
    t.match(stdout, /^hello.{0,1}=world$/gm)
    t.equal(stdout.match(/hello/gm).length, 2)
  })
})

test('restore with key and tag filter', t => {
  t.plan(2)
  h.createTestKeepyStoreWithKeys()
  const cli = spawn(node, ['cli', 'restore', '-k', 'hello3', '-t', 'alone', '-w', 'ciao'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (data) => {
    t.equal(data, 'hello3=world\n')
  })
  cli.on('close', (code) => {
    t.equal(code, 0)
  })
})

test('restore unexisting key', t => {
  t.plan(1)
  h.createTestKeepyStoreWithKeys()
  const cli = spawn(node, ['cli', 'restore', '-k', 'none', '-w', 'ciao'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', () => { t.fail() })
  cli.on('close', (code) => {
    t.equal(code, 0)
  })
})

test('help', t => {
  t.plan(2)
  const cli = spawn(node, ['cli', 'restore', '-h'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (output) => {
    const contentHelp = h.readFileHelp('restore')
    t.equal(output, contentHelp)
    t.pass()
  })
})

test('help when wrong params', t => {
  t.plan(2)
  const cli = spawn(node, ['cli', 'restore', 'what', 'is', 'this'])
  cli.stdout.setEncoding('utf8')
  cli.stdout.on('data', (output) => {
    const contentHelp = h.readFileHelp('restore')
    t.equal(output, contentHelp)
    t.pass()
  })
})
