'use strict'

const t = require('tap')
const test = t.test
const parseArgs = require('../lib/args')

test('parse all args', t => {
  t.plan(1)

  const argv = [
    '--update', 'true',
    '--env', 'true',
    '--help', 'true',
    '--yes', 'true',
    '--overwrite', 'true',
    '--stout', 'true',
    '--key', 'the_key',
    '--payload', 'the_payload',
    '--file', '.env',
    '--password', 'hello',
    '--tags', 'tag1',
    '--tags', 'tag2',
    '--tags', 'tag3',
    '--showtag', 'true'
  ]
  const parsedArgs = parseArgs(argv)

  t.strictSame(parsedArgs, {
    _: [],
    update: true,
    env: true,
    help: true,
    yes: true,
    overwrite: true,
    stout: true,
    key: 'the_key',
    payload: 'the_payload',
    file: '.env',
    password: 'hello',
    tags: ['tag1', 'tag2', 'tag3'],
    showtag: true
  })
})

test('check default values', t => {
  t.plan(1)
  const parsedArgs = parseArgs([])

  t.strictSame(parsedArgs, {
    _: [],
    update: false,
    env: false,
    help: false,
    yes: false,
    overwrite: false,
    stout: false,
    key: undefined,
    payload: undefined,
    file: undefined,
    password: undefined,
    tags: [],
    showtag: false
  })
})

test('parse args with = assignment', t => {
  t.plan(1)

  const argv = [
    '--update',
    '--env',
    '--help',
    '--yes',
    '--overwrite',
    '--stout',
    '--key=the_key',
    '--payload=the_payload',
    '--file=.env',
    '--password=hello',
    '--tags=tag1',
    '--tags=tag2',
    '--showtag'
  ]
  const parsedArgs = parseArgs(argv)

  t.strictSame(parsedArgs, {
    _: [],
    update: true,
    env: true,
    help: true,
    yes: true,
    overwrite: true,
    stout: true,
    key: 'the_key',
    payload: 'the_payload',
    file: '.env',
    password: 'hello',
    tags: ['tag1', 'tag2'],
    showtag: true
  })
})

test('parse args aliases', t => {
  t.plan(1)

  const argv = [
    '-u',
    '-e',
    '-h',
    '-Y',
    '-F',
    '-s',
    '-k=the_key',
    '-p=the_payload',
    '-f=.env',
    '-w=hello',
    '-t=tag11',
    '-t=tag22',
    '-g'
  ]
  const parsedArgs = parseArgs(argv)

  t.strictSame(parsedArgs, {
    _: [],
    update: true,
    env: true,
    help: true,
    yes: true,
    overwrite: true,
    stout: true,
    key: 'the_key',
    payload: 'the_payload',
    file: '.env',
    password: 'hello',
    tags: ['tag11', 'tag22'],
    showtag: true
  })
})

test('parse numbers as string', t => {
  t.plan(1)

  const argv = [
    '-u',
    '-e',
    '-h',
    '-Y',
    '-F',
    '-s',
    '-k=007',
    '-p=0042',
    '-f=.env',
    '-w=01234',
    '-t=01',
    '-t=+02',
    '-g'
  ]
  const parsedArgs = parseArgs(argv)

  t.strictSame(parsedArgs, {
    _: [],
    update: true,
    env: true,
    help: true,
    yes: true,
    overwrite: true,
    stout: true,
    key: '007',
    payload: '0042',
    file: '.env',
    password: '01234',
    tags: ['01', '+02'],
    showtag: true
  })
})
