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
  const res = await fetch(baseURL + '/auth/request-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  })
  if (!res.ok) {
    throw new Error('request_otp_failed')
  }
  return res.json()
}

export async function verifyOtp(phone, otp) {
  const res = await fetch(baseURL + '/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp })
  })
  if (!res.ok) {
    throw new Error('verify_otp_failed')
  }
  return res.json()
}

export default { requestOtp, verifyOtp }
