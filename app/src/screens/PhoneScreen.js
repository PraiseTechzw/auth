import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native'
import { requestOtp } from '../api/client'
import Constants from 'expo-constants'

export default function PhoneScreen({ onRequested }) {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const apiUrl = (Constants?.expoConfig?.extra || Constants?.manifest?.extra || {}).apiUrl
  const [cooldownSec, setCooldownSec] = useState(0)
  useEffect(() => {
    if (cooldownSec <= 0) return
    const id = setInterval(() => {
      setCooldownSec(s => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [cooldownSec])

  const submit = async () => {
    setError('')
    setLoading(true)
    const r = await requestOtp(phone)
    if (r && r.success) {
      onRequested(r.phone, { cooldownMs: r.cooldownMs, expireMs: r.expireMs })
    } else {
      const msg = r && r.error ? String(r.error) : 'Request failed'
      setError(msg)
      if (msg === 'cooldown') {
        const sec = Math.ceil(((r.remainingMs || r.cooldownMs || 0)) / 1000)
        setCooldownSec(sec)
      }
    }
    {
      setLoading(false)
    }
  }

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 12 }}>Verify phone</Text>
      {apiUrl ? <Text style={{ color: '#666', marginBottom: 8 }}>Backend: {apiUrl}</Text> : null}
      <TextInput
        value={phone}
        onChangeText={t => setPhone(t.replace(/\\s+/g, ''))}
        placeholder="Enter phone (e.g. 0771234567)"
        keyboardType="phone-pad"
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 }}
      />
      {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
      <Pressable onPress={submit} disabled={loading || cooldownSec > 0} style={{ backgroundColor: (loading || cooldownSec > 0) ? '#ccc' : '#0a84ff', padding: 14, borderRadius: 8, alignItems: 'center' }}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '600' }}>{cooldownSec > 0 ? ('Try again in ' + cooldownSec + 's') : 'Send code'}</Text>}
      </Pressable>
    </View>
  )
}
