
const { prompt } = require('enquirer')
const log = require('../lib/notify')

module.exports.password = async function askForPassword (reminder = '') {
  const question = {
    type: 'password',
    name: 'password',
    message: `Input password -${reminder}-`
  }
  try {
    return (await prompt(question)).password
  } catch (error) {
    return log.error('❌ Operation cancelled', 2)
  }
}
