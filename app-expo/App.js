import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import PhoneScreen from './src/screens/PhoneScreen'
import OtpScreen from './src/screens/OtpScreen'
import React, { useState } from 'react'

export default function App() {
  const [step, setStep] = useState('phone')
  const [ctx, setCtx] = useState({ phone: '', cooldownMs: 45000, expireMs: 300000 })
  return (
    <View style={{ flex: 1 }}>
      {step === 'phone' ? (
        <PhoneScreen
          onRequested={(phone, meta) => {
            setCtx({ phone, cooldownMs: meta.cooldownMs, expireMs: meta.expireMs })
            setStep('otp')
          }}
        />
      ) : (
        <OtpScreen
          phone={ctx.phone}
          cooldownMs={ctx.cooldownMs}
          expireMs={ctx.expireMs}
          onBack={() => setStep('phone')}
          onVerified={() => setStep('phone')}
        />
      )}
      <StatusBar style="auto" />
    </View>
  )
}

const styles = {}
