'use strict'

const { needToShowHelp } = require('../lib/help')

module.exports = async function () {
  needToShowHelp('help.txt', { help: true })
}
