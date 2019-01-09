'use strict'

class Commands {
  constructor () {
    this.commands = ['add', 'backup', 'delete', 'help', 'init', 'restore']
  }

  register (commist) {
    this.commands.forEach(command => {
      commist.register(command, require(`./${command}`))
    })
  }
}

module.exports = new Commands()
