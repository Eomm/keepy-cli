'use strict'

const argv = require('yargs-parser')

module.exports = function parseArgs (args) {
  const parsedArgs = argv(args, {
    configuration: { 'parse-numbers': false },
    boolean: ['update', 'env', 'help', 'yes', 'overwrite', 'stout', 'showtag'],
    string: ['key', 'payload', 'file', 'password'],
    array: ['tags'],
    alias: {
      update: ['u'],
      env: ['e'],
      help: ['h'],
      yes: ['Y'],
      overwrite: ['F'],
      stout: ['s'],
      key: ['k'],
      payload: ['p'],
      file: ['f'],
      password: ['w'],
      tags: ['t'],
      showtag: ['g']
    },
    default: {
      update: false,
      env: false,
      help: false,
      yes: false,
      overwrite: false,
      stout: false,
      showtag: false,
      tags: []
    }
  })

  // remove the aliases this way
  return Object.assign({}, {
    _: parsedArgs._,
    update: parsedArgs.update,
    env: parsedArgs.env,
    help: parsedArgs.help,
    yes: parsedArgs.yes,
    overwrite: parsedArgs.overwrite,
    stout: parsedArgs.stout,
    key: parsedArgs.key,
    payload: parsedArgs.payload,
    file: parsedArgs.file,
    password: parsedArgs.password,
    tags: parsedArgs.tags,
    showtag: parsedArgs.showtag
  })
}
