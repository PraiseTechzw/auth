let baseUrl = ''
let storage = null

function setBaseUrl(url) {
  baseUrl = String(url || '')
  if (storage && baseUrl) {
    try { storage.setItem && storage.setItem('otp_base_url', baseUrl) } catch (_) {}
  }
}

async function getBaseUrl() {
  if (!baseUrl && storage) {
    try {
      const v = storage.getItem && await storage.getItem('otp_base_url')
      if (v) baseUrl = v
    } catch (_) {}
  }
  if (baseUrl) return baseUrl
  if (typeof process !== 'undefined' && process.env && process.env.OTP_BASE_URL) return process.env.OTP_BASE_URL
  return 'http://localhost:3010'
}

function attachStorage(s) {
  storage = s || null
}

async function fetchJson(path, method, body, opts) {
  const timeoutMs = (opts && opts.timeoutMs) || 10000
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null
  try {
    const url = (await getBaseUrl()) + path
    const res = await fetch(url, {
      method: method || 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller ? controller.signal : undefined
    })
    const data = await res.json().catch(() => ({}))
    return { status: res.status, data }
  } finally {
    if (timer) clearTimeout(timer)
  }
}

async function health(opts) {
  const r = await fetchJson('/health', 'GET', null, opts)
  return r.data
}

async function requestOtp(phone, opts) {
  const r = await fetchJson('/auth/request-otp', 'POST', { phone }, opts)
  return r.data
}

async function verifyOtp(phone, otp, opts) {
  const r = await fetchJson('/auth/verify-otp', 'POST', { phone, otp }, opts)
  return r.data
}

module.exports = {
  setBaseUrl,
  getBaseUrl,
  attachStorage,
  health,
  requestOtp,
  verifyOtp
}
