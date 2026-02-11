import React, { useState } from 'react'
import { SafeAreaView, View } from 'react-native'
import PhoneScreen from './src/screens/PhoneScreen'
import OtpScreen from './src/screens/OtpScreen'

export default function App() {
  const [step, setStep] = useState('phone')
  const [phone, setPhone] = useState('')
  const [cooldownMs, setCooldownMs] = useState(45000)
  const [expireMs, setExpireMs] = useState(300000)

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {step === 'phone' && <PhoneScreen onRequested={onRequested} />}
        {step === 'otp' && <OtpScreen phone={phone} cooldownMs={cooldownMs} expireMs={expireMs} onVerified={onVerified} onBack={() => setStep('phone')} />}
      </View>
    </SafeAreaView>
  )
}
