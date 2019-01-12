'use strict'

const argv = require('yargs-parser')

module.exports = function parseArgs (args) {
  const parsedArgs = argv(args, {
    boolean: ['update', 'env', 'help', 'yes', 'overwrite', 'stout'],
    string: ['key', 'payload', 'file', 'password'],
    array: ['tags'],
    alias: {
      update: ['u'],
      help: ['h', 'man'],
      key: ['k'],
      yes: ['Y'],
      env: ['e'],
      password: ['w'],
      payload: ['p'],
      tags: ['t'],
      stout: ['s'],
      file: ['f'],
      overwrite: ['F']
    },
    default: {
      update: false,
      help: false,
      env: false,
      yes: false,
      overwrite: false,
      file: __dirname
    }
  })

  return { ...parsedArgs }

  // Object.assign({}, {
  //   _: parsedArgs._,
  //   port: parsedArgs.port,
  //   bodyLimit: parsedArgs.bodyLimit,
  //   pluginTimeout: parsedArgs.pluginTimeout,
  //   prettyLogs: parsedArgs.prettyLogs,
  //   watch: parsedArgs.watch,
  //   ignoreWatch: parsedArgs.ignoreWatch,
  //   logLevel: parsedArgs.logLevel,
  //   address: parsedArgs.address,
  //   socket: parsedArgs.socket,
  //   prefix: parsedArgs.prefix
  // })
}
