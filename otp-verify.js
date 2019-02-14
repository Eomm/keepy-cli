const twoFactor = require('node-2fa')
const secret = 'UR5N53BEGUV5KE2WIRWB6LITNZUG2QI4'
console.log('Enter OTP:')
process.stdin.setEncoding('utf8')
process.stdin.on('data', (data) => {
  const out = twoFactor.verifyToken(secret, data)
  if (out === null) {
    console.log('Wrong TOKEN!')
  } else {
    console.log('👍')
  }
})
