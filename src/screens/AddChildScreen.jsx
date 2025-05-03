// src/screens/AddChildScreen.jsx
import React, { useState } from 'react'
import { Alert } from 'react-native'
import {
  Button,
  Card,
  Input,
  Spinner,
  Text,
  YStack,
} from 'tamagui'
import api from '../api/api'
import { getToken } from '../utils/storage'

export default function AddChildScreen({ navigation }) {
  /* ─── 상태 ─── */
  const [childId, setChildId]         = useState('')
  const [code, setCode]               = useState('')
  const [phone, setPhone]             = useState('')
  const [step, setStep]               = useState('ID')   // 'ID' | 'CODE' | 'DONE'
  const [loading, setLoading]         = useState(false)

  /* ─── 1) 인증번호 전송 ─── */
  const requestCode = async () => {
    if (!childId) return Alert.alert('자녀 ID를 입력하세요')
    try {
      setLoading(true)
      /* ① 자녀 프로필에서 전화번호 조회 */
      const { data }   = await api.get(`/guardian/children/${childId}`)
      const phoneNum   = data.phone_number
      if (!phoneNum)   throw new Error('전화번호가 없습니다')
      setPhone(phoneNum)

      /* ② 인증번호 전송 */
      await api.post('/guardian/sms/send', { phone_number: phoneNum })
      Alert.alert('인증번호가 발송되었습니다')
      setStep('CODE')
    } catch (e) {
      console.log(e)
      Alert.alert('실패', 'ID가 잘못됐거나 네트워크 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  /* ─── 2) 인증번호 확인 + 자녀 연결 ─── */
  const verifyAndAdd = async () => {
    if (!code) return Alert.alert('인증번호를 입력하세요')
    try {
      setLoading(true)
      /* ① 번호 확인 */
      await api.post('/guardian/sms/verify', {
        phone_number: phone,
        certification_code: code,
      })

      /* ② 자녀‑보호자 연결 */
      const token = await getToken()
      await api.post(
        '/guardian/children',
        { children_id: Number(childId) },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      Alert.alert('자녀가 정상적으로 추가되었습니다', '', [
        { text: '확인', onPress: () => navigation.goBack() },
      ])
      setStep('DONE')
    } catch (e) {
      console.log(e)
      const { status } = e.response ?? {}
      if (status === 400) Alert.alert('잘못된 인증번호입니다')
      else                 Alert.alert('처리 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  /* ─── UI ─── */
  return (
    <YStack f={1} jc="center" ai="center" bg="$background" p="$5">
      <Card bordered size="$5" width="100%" maw={420} p="$4" space="$4">
        <Text fontSize="$6" fontWeight="bold" ta="center">
          자녀 ID 등록
        </Text>

        {step === 'ID' && (
          <>
            <Input
              placeholder="추가할 자녀 ID 입력"
              keyboardType="numeric"
              value={childId}
              onChangeText={setChildId}
              editable={!loading}
            />
            <Button
              onPress={requestCode}
              disabled={loading}
              theme="active"
            >
              {loading ? <Spinner /> : '인증번호 요청'}
            </Button>
          </>
        )}

        {step === 'CODE' && (
          <>
            <Text ta="center">{phone} 로 발송된 번호 입력</Text>
            <Input
              placeholder="6자리 인증번호"
              keyboardType="numeric"
              value={code}
              onChangeText={setCode}
              editable={!loading}
            />
            <Button
              onPress={verifyAndAdd}
              disabled={loading}
              theme="active"
            >
              {loading ? <Spinner /> : '자녀 추가'}
            </Button>
          </>
        )}

        {step === 'DONE' && (
          <Text ta="center">🎉 완료되었습니다</Text>
        )}
      </Card>
    </YStack>
  )
}