const dotenv = require('dotenv')
dotenv.config()

const env = process.env

const config = {
  port: parseInt(env.PORT || '3000', 10),
  smsToken: env.SMSPOP_TOKEN || '',
  smsSenderId: env.SMSPOP_SENDER_ID || 'BRAND1',
  otpPepper: env.OTP_PEPPER || '',
  otpExpireMs: 5 * 60 * 1000,
  resendCooldownMs: 45 * 1000,
  maxVerifyAttempts: 5,
  rateLimitWindowMs: 15 * 60 * 1000,
  rateLimitMaxRequests: 5,
  dryRunSms: (env.DRY_RUN_SMS || 'true').toLowerCase() === 'true',
  corsOrigin: env.CORS_ORIGIN || '*'
}

let overrideDryRun = null
function setDryRun(flag) {
  overrideDryRun = !!flag
}
function isDryRun() {
  return overrideDryRun !== null ? overrideDryRun : config.dryRunSms
}

module.exports = { config, setDryRun, isDryRun }
