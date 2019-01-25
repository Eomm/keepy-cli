'use strict'

class Commands {
  constructor () {
    this.commands = ['add', 'delete', 'help', 'init', 'restore', 'version']
  }

  register (commist) {
    this.commands.forEach(command => {
      commist.register(command, require(`./${command}`))
    })
  }
}

module.exports = new Commands()
