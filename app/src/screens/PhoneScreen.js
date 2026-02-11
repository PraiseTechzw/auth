import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native'
import { requestOtp } from '../api/client'

export default function PhoneScreen({ onRequested }) {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    setError('')
    setLoading(true)
    try {
      const r = await requestOtp(phone)
      if (r && r.success) {
        onRequested(r.phone, { cooldownMs: r.cooldownMs, expireMs: r.expireMs })
      } else {
        setError('Request failed')
      }
    } catch (e) {
      setError('Could not send code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 12 }}>Verify phone</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter phone (e.g. 0771234567)"
        keyboardType="phone-pad"
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 }}
      />
      {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
      <Pressable onPress={submit} disabled={loading} style={{ backgroundColor: '#0a84ff', padding: 14, borderRadius: 8, alignItems: 'center' }}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '600' }}>Send code</Text>}
      </Pressable>
    </View>
  )
}
