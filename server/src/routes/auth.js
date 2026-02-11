const express = require('express')
const { normalizeZimbabwePhone } = require('../utils/phone')
const { generateOtp6, hashOtp } = require('../utils/otp')
const { setOtp, canResend, rateLimited, verifyOtp } = require('../store/memoryStore')
const { sendOtpSMS } = require('../services/sms')
const { config } = require('../config')

const router = express.Router()

router.post('/request-otp', async (req, res) => {
  try {
    const { phone } = req.body || {}
    const normalized = normalizeZimbabwePhone(String(phone || ''))
    if (rateLimited(normalized)) {
      return res.status(429).json({ success: false, error: 'rate_limited' })
    }
    if (!canResend(normalized)) {
      const cooldownMs = config.resendCooldownMs
      return res.status(429).json({ success: false, error: 'cooldown', cooldownMs })
    }
    const otp = generateOtp6()
    const otpHash = hashOtp(otp, config.otpPepper)
    setOtp(normalized, otpHash)
    await sendOtpSMS(normalized, otp)
    return res.json({ success: true, phone: normalized, expireMs: config.otpExpireMs, cooldownMs: config.resendCooldownMs })
  } catch (e) {
    const status = e.status || 400
    let code = 'bad_request'
    if (status === 401) code = 'unauthorized'
    if (status === 402) code = 'payment_required'
    if (status === 403) code = 'forbidden'
    if (status === 422) code = 'unprocessable'
    if (status === 500) code = 'server_misconfig'
    if (status === 502) code = 'sms_bad_response'
    if (status === 503) code = 'sms_network'
    return res.status(status).json({ success: false, error: code })
  }
})

router.post('/verify-otp', (req, res) => {
  try {
    const { phone, otp } = req.body || {}
    const normalized = normalizeZimbabwePhone(String(phone || ''))
    const otpHash = hashOtp(String(otp || ''), config.otpPepper)
    const result = verifyOtp(normalized, otpHash)
    if (result.ok) {
      return res.json({ success: true })
    }
    if (result.reason === 'expired') {
      return res.status(400).json({ success: false, error: 'expired' })
    }
    if (result.reason === 'attempts_exceeded') {
      return res.status(429).json({ success: false, error: 'attempts_exceeded' })
    }
    if (result.reason === 'not_found') {
      return res.status(404).json({ success: false, error: 'not_found' })
    }
    if (result.reason === 'mismatch') {
      return res.status(400).json({ success: false, error: 'mismatch', remaining: result.remaining })
    }
    return res.status(400).json({ success: false, error: 'invalid' })
  } catch (e) {
    return res.status(400).json({ success: false, error: 'bad_request' })
  }
})

module.exports = router
