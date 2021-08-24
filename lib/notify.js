'use strict'

const chalk = require('chalk')

class Notify {
  constructor () {
    this.colors = {
      debug: chalk.blue,
      warn: chalk.yellow,
      info: chalk.green,
      error: chalk.red
    }
  }

  debug (msg) {
    console.log(this.colors.debug(msg))
  }

  info (msg) {
    console.log(this.colors.info(msg))
  }

  warn (msg) {
    console.log(this.colors.warn(msg))
  }

  error (msg, exitCode = 0) {
    console.log(this.colors.error(msg))
    if (exitCode > 0) {
      process.exit(exitCode)
    }
  }
}

module.exports = new Notify()
