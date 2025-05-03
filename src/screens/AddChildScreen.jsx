// src/screens/AddChildScreen.jsx
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from '@tamagui/linear-gradient'
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
  const [childId, setChildId] = useState('')
  const [code, setCode]       = useState('')
  const [phone, setPhone]     = useState('')
  const [step, setStep]       = useState('ID')   // 'ID' | 'CODE' | 'DONE'
  const [loading, setLoading] = useState(false)

  /* ─── 인증번호 요청 ─── */
  const requestCode = async () => {
    if (!childId) {
      return Alert.alert('자녀 ID를 입력하세요')
    }
    try {
      setLoading(true)
      const { data } = await api.get(`/guardian/children/${childId}`)
      const phoneNum = data.phone_number
      if (!phoneNum) throw new Error('전화번호가 없습니다')
      setPhone(phoneNum)

      await api.post('/guardian/sms/send', { phone_number: phoneNum })
      Alert.alert('인증번호가 발송되었습니다')
      setStep('CODE')
    } catch (e) {
      console.error(e)
      Alert.alert('실패', 'ID가 잘못됐거나 네트워크 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  /* ─── 인증번호 검증 + 연결 ─── */
  const verifyAndAdd = async () => {
    if (!code) {
      return Alert.alert('인증번호를 입력하세요')
    }
    try {
      setLoading(true)
      await api.post('/guardian/sms/verify', {
        phone_number: phone,
        certification_code: code,
      })

      const token = await getToken()
      await api.post(
        '/guardian/children',
        { children_id: Number(childId) },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      Alert.alert('완료되었습니다', '', [
        { text: '확인', onPress: () => navigation.goBack() },
      ])
      setStep('DONE')
    } catch (e) {
      console.error(e)
      if (e.response?.status === 400) {
        Alert.alert('잘못된 인증번호입니다')
      } else {
        Alert.alert('처리 중 오류가 발생했습니다')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <YStack f={1} bg="$background" jc="center" ai="center" p="$3">
      <Card bordered elevate size="$5" w="90%" maw={420} p="$6" space="$5">
        {/* 헤더 */}
        <MaskedView
          style={{ height: 60, alignSelf: 'stretch' }}
          maskElement={
            <YStack f={1} jc="center" ai="center">
              <Text fontSize="$8" fontWeight="900" letterSpacing={1}>
                자녀 ID 등록
              </Text>
            </YStack>
          }
        >
          <LinearGradient
            f={1}
            colors={['#6B73FF', '#A78BFA']}
            start={[0, 0]}
            end={[1, 1]}
          />
        </MaskedView>

        <YStack ai="stretch" space="$6">
          {step === 'ID' && (
            <YStack space="$4">
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
                size="$4"
                width="100%"
                bc="transparent"
                p={0}
              >
                <LinearGradient
                  f={1}
                  colors={['#6B73FF', '#A78BFA']}
                  start={[0, 0]}
                  end={[1, 1]}
                  br={8}
                  py="$3"
                >
                  {loading
                    ? <Spinner color="white" />
                    : <Text ta="center" color="white" fontWeight="600">인증번호 요청</Text>}
                </LinearGradient>
              </Button>
            </YStack>
          )}

          {step === 'CODE' && (
            <YStack space="$4">
              <Text ta="center" fontSize="$3" color="$gray11">
                {phone} 로 발송된 번호 입력
              </Text>
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
                size="$4"
                width="100%"
                bc="transparent"
                p={0}
              >
                <LinearGradient
                  f={1}
                  colors={['#6B73FF', '#A78BFA']}
                  start={[0, 0]}
                  end={[1, 1]}
                  br={8}
                  py="$3"
                >
                  {loading
                    ? <Spinner color="white" />
                    : <Text ta="center" color="white" fontWeight="600">자녀 추가</Text>}
                </LinearGradient>
              </Button>
            </YStack>
          )}

          {step === 'DONE' && (
            <Text ta="center" fontSize="$4">
              🎉 자녀가 추가되었습니다!
            </Text>
          )}
        </YStack>
      </Card>
    </YStack>
  )
}