'use strict'

const t = require('tap')
const rimraf = require('rimraf')

const { test, beforeEach } = t
const node = process.execPath

beforeEach(done => { rimraf('keepy*.json', done) })

test('init', t => {
  t.on('spawn', async spawned => {
    // t.proc.stdout.setEncoding('utf8')
    // t.proc.stdout.once('data', console.log)

    spawned.proc.stdin.write('password\n')
    await wait(600)
    spawned.proc.stdin.write('my personal hint\n')
    await wait(600)

    t.pass('init completed')
    t.end()
  })
  t.spawn(node, ['cli', 'init'], { stdio: ['pipe', 'pipe', 'ignore'] })
})

function wait (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
