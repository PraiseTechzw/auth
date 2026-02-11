const { config } = require('../config')

const store = new Map()

function now() {
  return Date.now()
}

function get(phone) {
  return store.get(phone) || null
}

function setOtp(phone, otpHash) {
  const t = now()
  const record = store.get(phone) || {
    attempts: 0,
    requestLog: []
  }
  record.otpHash = otpHash
  record.createdAt = t
  record.expiresAt = t + config.otpExpireMs
  record.attempts = 0
  record.lastRequestAt = t
  record.resendAvailableAt = t + config.resendCooldownMs
  record.requestLog = (record.requestLog || []).filter(x => t - x <= config.rateLimitWindowMs)
  record.requestLog.push(t)
  store.set(phone, record)
  return record
}

function canResend(phone) {
  const r = store.get(phone)
  if (!r) return true
  return now() >= (r.resendAvailableAt || 0)
}

function resendRemainingMs(phone) {
  const r = store.get(phone)
  if (!r) return 0
  const rem = (r.resendAvailableAt || 0) - now()
  return rem > 0 ? rem : 0
}

function rateLimited(phone) {
  const r = store.get(phone)
  if (!r) return false
  const t = now()
  r.requestLog = (r.requestLog || []).filter(x => t - x <= config.rateLimitWindowMs)
  return r.requestLog.length >= config.rateLimitMaxRequests
}

function verifyOtp(phone, otpHash) {
  const r = store.get(phone)
  if (!r) return { ok: false, reason: 'not_found' }
  const t = now()
  if (t > r.expiresAt) {
    store.delete(phone)
    return { ok: false, reason: 'expired' }
  }
  if ((r.attempts || 0) >= config.maxVerifyAttempts) {
    store.delete(phone)
    return { ok: false, reason: 'attempts_exceeded' }
  }
  const match = r.otpHash === otpHash
  r.attempts = (r.attempts || 0) + 1
  store.set(phone, r)
  if (match) {
    store.delete(phone)
    return { ok: true }
  }
  const remaining = Math.max(0, config.maxVerifyAttempts - r.attempts)
  return { ok: false, reason: 'mismatch', remaining }
}

module.exports = { setOtp, canResend, rateLimited, get, verifyOtp, resendRemainingMs }
