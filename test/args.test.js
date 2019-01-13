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
    '--tags', 'tag3'
  ]
  const parsedArgs = parseArgs(argv)

  t.strictDeepEqual(parsedArgs, {
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
    tags: ['tag1', 'tag2', 'tag3']
  })
})

test('check default values', t => {
  t.plan(1)
  const parsedArgs = parseArgs([])

  t.strictDeepEqual(parsedArgs, {
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
    tags: []
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
    '--tags=tag2'
  ]
  const parsedArgs = parseArgs(argv)

  t.strictDeepEqual(parsedArgs, {
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
    tags: ['tag1', 'tag2']
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
    '-t=tag22'
  ]
  const parsedArgs = parseArgs(argv)

  t.strictDeepEqual(parsedArgs, {
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
    tags: ['tag11', 'tag22']
  })
})
