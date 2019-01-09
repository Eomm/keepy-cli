'use strict'

const chalk = require('chalk')

class Logger {
  constructor () {
    this.colors = {
      debug: chalk.blue,
      info: chalk.green,
      error: chalk.red
    }
  }
  debug (msg) {
    console.log(this.colors['debug'](msg))
  }
  info (msg) {
    console.log(this.colors['info'](msg))
  }
  error (msg) {
    console.log(this.colors['error'](msg))
    // ? should process.exit(-1) ?
  }
}

module.exports = new Logger()
