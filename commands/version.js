'use strict'

const { version } = require('../package.json')

module.exports = function () {
  console.log(`keepy v${version}`)
}
module.exports.version = version
