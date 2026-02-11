import Constants from 'expo-constants'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import cfg from '../config.json'

function resolveBaseUrl() {
  const extra = Constants?.expoConfig?.extra || Constants?.manifest?.extra || {}
  if (cfg && cfg.apiUrl) return cfg.apiUrl
  if (extra.apiUrl) return extra.apiUrl
  if (Platform.OS === 'android') return 'http://10.0.2.2:3010'
  return 'http://localhost:3010'
}

let overrideUrl = null
async function getApiUrl() {
  if (!overrideUrl) {
    try {
      const v = await AsyncStorage.getItem('apiUrl')
      if (v) overrideUrl = v
    } catch (_e) {}
  }
  return overrideUrl || resolveBaseUrl()
}
export async function setApiUrl(url) {
  overrideUrl = url
  try { await AsyncStorage.setItem('apiUrl', url) } catch (_e) {}
}

export async function requestOtp(phone) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 10000)
  const baseURL = await getApiUrl()
  let res, data = null
  try {
    res = await fetch(baseURL + '/auth/request-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
      signal: controller.signal
    })
  } catch (e) {
    clearTimeout(timer)
    return { success: false, error: 'network_error', message: String(e.message || e) }
  }
  clearTimeout(timer)
  data = null
  try { data = await res.json() } catch (_e) {}
  if (res.ok) return data
  return data || { success: false, error: 'request_otp_failed' }
}

export async function verifyOtp(phone, otp) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 10000)
  const baseURL = await getApiUrl()
  let res, data = null
  try {
    res = await fetch(baseURL + '/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
      signal: controller.signal
    })
  } catch (e) {
    clearTimeout(timer)
    return { success: false, error: 'network_error', message: String(e.message || e) }
  }
  clearTimeout(timer)
  data = null
  try { data = await res.json() } catch (_e) {}
  if (res.ok) return data
  return data || { success: false, error: 'verify_otp_failed' }
}

export async function health() {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 5000)
  const baseURL = await getApiUrl()
  let res, data = null
  try {
    res = await fetch(baseURL + '/health', {
      method: 'GET',
      signal: controller.signal
    })
  } catch (e) {
    clearTimeout(timer)
    return { ok: false, error: 'network_error', message: String(e.message || e) }
  }
  clearTimeout(timer)
  try { data = await res.json() } catch (_e) {}
  if (res.ok && data && data.ok) return { ok: true }
  return { ok: false, error: 'health_failed', status: res ? res.status : undefined, body: data }
}

export default { requestOtp, verifyOtp, health, setApiUrl, getApiUrl }
