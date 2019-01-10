'use strict'

const argv = require('yargs-parser')

module.exports = function parseArgs (args) {
  const parsedArgs = argv(args, {
    boolean: ['verbose', 'options', 'env', 'help', 'yes', 'overwrite', 'stout'],
    string: ['key', 'payload', 'file', 'tag', 'password'],
    array: ['labels'],
    alias: {
      verbose: ['v'],
      options: ['o'],
      help: ['h', 'man'],
      key: ['k'],
      yes: ['Y'],
      env: ['e'],
      password: ['w'],
      payload: ['p'],
      labels: ['l'],
      tag: ['t'],
      stout: ['s'],
      file: ['f'],
      overwrite: ['F']
    },
    default: {
      verbose: false,
      options: false,
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
  //   options: parsedArgs.options,
  //   watch: parsedArgs.watch,
  //   ignoreWatch: parsedArgs.ignoreWatch,
  //   logLevel: parsedArgs.logLevel,
  //   address: parsedArgs.address,
  //   socket: parsedArgs.socket,
  //   prefix: parsedArgs.prefix
  // })
}
