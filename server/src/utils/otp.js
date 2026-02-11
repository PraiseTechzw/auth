const crypto = require('crypto')

function generateOtp6() {
  const n = crypto.randomInt(0, 1000000)
  return n.toString().padStart(6, '0')
}

function hashOtp(otp, pepper) {
  const h = crypto.createHash('sha256')
  h.update(otp + pepper, 'utf8')
  return h.digest('hex')
}

module.exports = { generateOtp6, hashOtp }
