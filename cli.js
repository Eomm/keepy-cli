#!/usr/bin/env node

'use strict'

const commist = require('commist')()
const command = require('./commands/command')

command.register(commist)
commist.register('version', function () {
  console.log(require('./package.json').version)
})

const res = commist.parse(process.argv.splice(2))

if (res) {
  // no command was recognized
  // TODO show help
}
