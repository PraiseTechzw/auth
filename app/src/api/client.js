import Constants from 'expo-constants'
import { Platform } from 'react-native'

function resolveBaseUrl() {
  const extra = Constants?.expoConfig?.extra || Constants?.manifest?.extra || {}
  if (extra.apiUrl) return extra.apiUrl
  if (Platform.OS === 'android') return 'http://10.0.2.2:3010'
  return 'http://localhost:3010'
}

const baseURL = resolveBaseUrl()

export async function requestOtp(phone) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 10000)
  const res = await fetch(baseURL + '/auth/request-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
    signal: controller.signal
  })
  clearTimeout(timer)
  let data = null
  try { data = await res.json() } catch (_e) {}
  if (res.ok) return data
  return data || { success: false, error: 'request_otp_failed' }
}

export async function verifyOtp(phone, otp) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 10000)
  const res = await fetch(baseURL + '/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp }),
    signal: controller.signal
  })
  clearTimeout(timer)
  let data = null
  try { data = await res.json() } catch (_e) {}
  if (res.ok) return data
  return data || { success: false, error: 'verify_otp_failed' }
}

export default { requestOtp, verifyOtp }

export async function health() {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 5000)
  const res = await fetch(baseURL + '/health', {
    method: 'GET',
    signal: controller.signal
  })
  clearTimeout(timer)
  let data = null
  try { data = await res.json() } catch (_e) {}
  if (res.ok && data && data.ok) return { ok: true }
  return { ok: false, error: 'health_failed' }
}
