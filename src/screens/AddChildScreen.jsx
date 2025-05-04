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
  const [step, setStep]       = useState('ID')   // 'ID' | 'CODE' | 'DONE'
  const [loading, setLoading] = useState(false)

  // ─── 1) 자녀 ID로 인증번호 요청 ───
  const requestCode = async () => {
    if (!childId.trim()) {
      Alert.alert('자녀 ID를 입력하세요')
      return
    }
    try {
      setLoading(true)
      const token = await getToken()
      await api.post(
        '/guardian/children',
        { children_id: childId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      Alert.alert('인증번호가 발송되었습니다')
      setStep('CODE')
    } catch (e) {
      console.error(e)
      Alert.alert('실패', 'ID가 잘못되었거나 네트워크 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  // ─── 2) 인증번호 검증 및 자녀 자동 등록 ───
  const verifyAndAdd = async () => {
    if (code.length !== 6) {
      Alert.alert('6자리 인증번호를 입력하세요')
      return
    }
    try {
      setLoading(true)
      const token = await getToken()
      await api.post(
        '/guardian/children/verify',
        {
          children_id: childId,
          certification_code: code,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      Alert.alert('자녀가 성공적으로 등록되었습니다', '', [
        { text: '확인', onPress: () => navigation.goBack() },
      ])
      setStep('DONE')
    } catch (e) {
      console.error(e)
      if (e.response?.status === 400) {
        Alert.alert('인증번호가 일치하지 않습니다')
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
                value={childId}
                onChangeText={setChildId}
                editable={!loading}
              />
              <Button
                onPress={requestCode}
                disabled={loading}
                size="$4"
                width="100%"
                backgroundColor="#A78BFA"
                color="white"
              >
                {loading ? (
                  <Spinner color="white" />
                ) : (
                  <Text ta="center" color="white" fontWeight="600">
                    인증번호 요청
                  </Text>
                )}
              </Button>
            </YStack>
          )}

          {step === 'CODE' && (
            <YStack space="$4">
              <Input
                placeholder="6자리 인증번호 입력"
                value={code}
                onChangeText={setCode}
                editable={!loading}
              />
              <Button
                onPress={verifyAndAdd}
                disabled={loading}
                size="$4"
                width="100%"
                backgroundColor="#A78BFA"
                color="white"
              >
                {loading ? (
                  <Spinner color="white" />
                ) : (
                  <Text ta="center" color="white" fontWeight="600">
                    자녀 추가
                  </Text>
                )}
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