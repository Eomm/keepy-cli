#!/usr/bin/env node

'use strict'

const commist = require('commist')()
const command = require('./commands/command')

command.register(commist)

const res = commist.parse(process.argv.splice(2))

if (res) {
  require('./commands/help')(['-h'])
}
