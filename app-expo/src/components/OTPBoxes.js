import React from 'react'
import { View, Text } from 'react-native'

export default function OTPBoxes({ value, length = 6 }) {
  const chars = (value || '').split('')
  const boxes = []
  for (let i = 0; i < length; i++) {
    const c = chars[i] || ''
    boxes.push(
      <View key={i} style={{ width: 44, height: 52, borderWidth: 1.5, borderColor: '#0a84ff', borderRadius: 8, marginHorizontal: 4, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: '600' }}>{c}</Text>
      </View>
    )
  }
  return <View style={{ flexDirection: 'row', justifyContent: 'center' }}>{boxes}</View>
}
