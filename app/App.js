import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, Pressable } from 'react-native'
import PhoneScreen from './src/screens/PhoneScreen'
import OtpScreen from './src/screens/OtpScreen'
import { health } from './src/api/client'

export default function App() {
  const [step, setStep] = useState('phone')
  const [phone, setPhone] = useState('')
  const [cooldownMs, setCooldownMs] = useState(45000)
  const [expireMs, setExpireMs] = useState(300000)
  const [backendStatus, setBackendStatus] = useState('unknown')
  const [lastEvent, setLastEvent] = useState('')
  const [lastPayload, setLastPayload] = useState(null)
  const [lastTime, setLastTime] = useState(0)

  const onRequested = (p, meta) => {
    setPhone(p)
    setCooldownMs(meta.cooldownMs)
    setExpireMs(meta.expireMs)
    setStep('otp')
  }

  const onVerified = () => {
    setStep('phone')
    setPhone('')
  }
  useEffect(() => {
    (async () => {
      const h = await health()
      setBackendStatus(h.ok ? 'connected' : 'offline')
      setLastEvent('health')
      setLastPayload(h)
      setLastTime(Date.now())
    })()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: backendStatus === 'connected' ? '#e7f8ec' : '#fdeaea' }}>
        <Text style={{ color: backendStatus === 'connected' ? '#0a7b35' : '#b00020', fontWeight: '600' }}>Backend: {backendStatus}</Text>
        <Pressable onPress={async () => { const h = await health(); setBackendStatus(h.ok ? 'connected' : 'offline'); setLastEvent('health'); setLastPayload(h); setLastTime(Date.now()) }} style={{ marginTop: 4 }}>
          <Text style={{ color: '#0a84ff' }}>Check again</Text>
        </Pressable>
        <Text style={{ color: '#666', marginTop: 4 }}>{lastTime ? new Date(lastTime).toLocaleTimeString() : ''}</Text>
        <Text style={{ color: '#666', marginTop: 4 }}>{lastPayload ? JSON.stringify(lastPayload) : ''}</Text>
      </View>
      <View style={{ flex: 1 }}>
        {step === 'phone' && <PhoneScreen onRequested={onRequested} />}
        {step === 'otp' && <OtpScreen phone={phone} cooldownMs={cooldownMs} expireMs={expireMs} onVerified={onVerified} onBack={() => setStep('phone')} />}
      </View>
    </SafeAreaView>
  )
}
