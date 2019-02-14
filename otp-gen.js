const twoFactor = require('node-2fa')
const qrcode = require('qrcode-terminal')

const newSecret = process.argv[2] === 'new'
let toQrCode = 'otpauth://totp/keepy-cli:john doe?secret=UR5N53BEGUV5KE2WIRWB6LITNZUG2QI4'
if (newSecret) {
  const secret = twoFactor.generateSecret({ name: 'keepy-cli', account: 'john doe' })
  console.log(secret)
  toQrCode = decodeURIComponent(secret.uri)
}

qrcode.setErrorLevel('Q')
qrcode.generate(toQrCode, { small: true })
console.log({ toQrCode })
