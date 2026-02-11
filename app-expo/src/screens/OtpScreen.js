import React, { useEffect, useRef, useState } from 'react'
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native'
import OTPBoxes from '../components/OTPBoxes'
import { requestOtp, verifyOtp } from '../api/client'

export default function OtpScreen({ phone, cooldownMs, expireMs, onVerified, onBack }) {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendAt, setResendAt] = useState(Date.now() + cooldownMs)
  const [now, setNow] = useState(Date.now())
  const inputRef = useRef(null)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      if (inputRef.current) inputRef.current.focus()
    }, 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (otp.length === 6) {
      submit()
    }
  }, [otp])

  const submit = async () => {
    setLoading(true)
    setError('')
    const r = await verifyOtp(phone, otp)
    if (r && r.success) {
      onVerified()
    } else {
      setError(r && r.error ? String(r.error) : 'Verification failed')
    }
    {
      setLoading(false)
      setOtp('')
    }
  }

  const resend = async () => {
    if (now < resendAt) return
    setLoading(true)
    setError('')
    const r = await requestOtp(phone)
    if (r && r.success) {
      setResendAt(Date.now() + (r.cooldownMs || cooldownMs))
    } else {
      setError(r && r.error ? String(r.error) : 'Resend failed')
    }
    {
      setLoading(false)
    }
  }

  const remaining = Math.max(0, Math.ceil((resendAt - now) / 1000))

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Pressable onPress={onBack}><Text style={{ color: '#0a84ff' }}>Back</Text></Pressable>
      <Text style={{ fontSize: 18, marginTop: 12 }}>Enter the 6-digit code sent to {phone}</Text>
      <Pressable onPress={() => inputRef.current && inputRef.current.focus()} style={{ marginVertical: 16 }}>
        <OTPBoxes value={otp} length={6} />
      </Pressable>
      <TextInput
        ref={inputRef}
        value={otp}
        onChangeText={t => setOtp(t.replace(/\D/g, '').slice(0, 6))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        maxLength={6}
        style={{ height: 0, width: 0, opacity: 0 }}
      />
      {error ? <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text> : null}
      <Pressable onPress={resend} disabled={loading || remaining > 0} style={{ marginTop: 16, backgroundColor: remaining > 0 ? '#ccc' : '#0a84ff', padding: 12, borderRadius: 8, alignItems: 'center' }}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '600' }}>{remaining > 0 ? 'Resend in ' + remaining + 's' : 'Resend code'}</Text>}
      </Pressable>
    </View>
  )
}
