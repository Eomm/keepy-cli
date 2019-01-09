'use strict'

const argv = require('yargs-parser')

module.exports = function parseArgs (args) {
  const parsedArgs = argv(args, {
    boolean: ['verbose', 'options', 'env', 'help', 'yes', 'overwrite'],
    string: ['key', 'payload', 'datastore'],
    array: ['labels'],
    alias: {
      verbose: ['v'],
      options: ['o'],
      help: ['h', 'man'],
      key: ['k'],
      yes: ['Y'],
      env: ['e'], // load password from env
      payload: ['p'],
      labels: ['l'],
      datastore: ['ds'],
      overwrite: ['F']
    },
    default: {
      verbose: false,
      options: false,
      help: false,
      env: false,
      yes: false,
      overwrite: false,
      datastore: __dirname
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
