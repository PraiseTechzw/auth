import axios from 'axios'
import Constants from 'expo-constants'
import { Platform } from 'react-native'

function resolveBaseUrl() {
  const extra = Constants?.expoConfig?.extra || Constants?.manifest?.extra || {}
  if (extra.apiUrl) return extra.apiUrl
  if (Platform.OS === 'android') return 'http://10.0.2.2:3000'
  return 'http://localhost:3000'
}

const api = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 10000
})

export async function requestOtp(phone) {
  const res = await api.post('/auth/request-otp', { phone })
  return res.data
}

export async function verifyOtp(phone, otp) {
  const res = await api.post('/auth/verify-otp', { phone, otp })
  return res.data
}

export default api
