'use strict'

const { exec } = require('child_process')

function executeScript (scriptToExecute) {
  return new Promise((resolve, reject) => {
    exec(scriptToExecute, (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}

function setEnvLinux (key, value) {
  // const shell = process.env.SHELL
  const script = `export ${key}=${value}`
  return executeScript(script)
}

function setEnvWindows (key, value) {
  return executeScript(`SETX ${key} ${value}`)
}

module.exports = function setEnv (key, value) {
  if (process.platform === 'win32') {
    return setEnvWindows(key, value)
  }
  return setEnvLinux(key, value)
}
