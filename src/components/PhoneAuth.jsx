import React, { useState } from 'react'
import { Alert } from 'react-native'
import { Button, Input, Spinner, YStack } from 'tamagui'
import api from '../api/api'

export default function PhoneAuth({ phone, onVerified }) {
  const [code, setCode] = useState('')
  const [requested, setReq] = useState(false)
  const [loading, setLoad] = useState(false)

  const requestCode = async () => {
    if (!phone) {
      Alert.alert('전화번호를 먼저 입력하세요!')
      return
    }
    try {
      setLoad(true)
      await api.post('/guardian/sms/send', { phone_number: phone })
      Alert.alert('인증번호가 발송되었습니다.')
      setReq(true)
    } catch (e) {
      console.error(e)
      Alert.alert('전송 실패', '전화번호를 확인하세요.')
    } finally {
      setLoad(false)
    }
  }

  const verifyCode = async () => {
    if (code.length !== 6) {
      Alert.alert('6자리 인증번호를 입력하세요')
      return
    }
    try {
      setLoad(true)
      await api.post('/guardian/sms/verify', {
        phone_number: phone,
        certification_code: code,
      })
      Alert.alert('인증 성공')
      onVerified()
    } catch (e) {
      console.error(e)
      Alert.alert('인증 실패', '코드를 다시 확인하세요.')
    } finally {
      setLoad(false)
    }
  }

  return (
    <YStack ai="stretch" space="$3" mt="$2">
      {/* 인증번호 요청 버튼 */}
      <Button
        onPress={requestCode}
        size="$4"
        disabled={!phone || requested || loading}
        backgroundColor="#3B82F6" // 파란색
        color="white"
        animation={{ type: 'spring', damping: 14, mass: 0.6, stiffness: 180 }}
        pressStyle={{ scale: 0.96, y: 2 }}
      >
        {loading && !requested ? (
          <Spinner color="white" />
        ) : (
          '인증번호 요청'
        )}
      </Button>

      {/* 인증번호 입력 및 확인 버튼 */}
      {requested && (
        <YStack ai="stretch" space="$3">
          <Input
            placeholder="6자리 인증번호"
            keyboardType="number-pad"
            maxLength={6}
            value={code}
            onChangeText={setCode}
            disabled={loading}
          />
          <Button
            onPress={verifyCode}
            size="$4"
            disabled={loading}
            backgroundColor="#EC4899" // 핑크색
            color="white"
            animation={{ type: 'spring', damping: 14, mass: 0.6, stiffness: 180 }}
            pressStyle={{ scale: 0.96, y: 2 }}
          >
            {loading ? (
              <Spinner color="white" />
            ) : (
              '인증번호 확인'
            )}
          </Button>
        </YStack>
      )}
    </YStack>
  )
}