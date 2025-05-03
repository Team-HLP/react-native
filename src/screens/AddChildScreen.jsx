import React, { useState } from 'react'
import { Alert } from 'react-native'
import {
  Button,
  Card,
  Input,
  Spinner,
  Text,
  YStack
} from 'tamagui'
import api from '../api/api'
import { getToken } from '../utils/storage'

export default function AddChildScreen({ navigation }) {
  const [childrenId, setChildrenId] = useState('')
  const [loading, setLoading] = useState(false)

  const addChild = async () => {
    if (!childrenId) return Alert.alert('자녀 ID를 입력하세요')

    try {
      setLoading(true)
      const token = await getToken()

      await api.post(
        '/guardian/children',
        { children_id: Number(childrenId) },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      Alert.alert('자녀 추가 성공', '자녀가 정상적으로 추가되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() },
      ])
    } catch (e) {
      console.log(e)
      const { status } = e.response ?? {}
      if (status === 400) {
        Alert.alert('이미 등록된 자녀이거나 잘못된 ID입니다.')
      } else if (status === 404) {
        Alert.alert('존재하지 않는 자녀 ID입니다.')
      } else {
        Alert.alert('네트워크 오류가 발생했습니다.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <YStack f={1} jc="center" ai="center" bg="$background" p="$5">
      <Card bordered size="$5" width="100%" maw={420}>
        <Card.Header padded>
          <Text fontWeight="bold" fontSize="$5" textAlign="center">
            자녀 ID 등록
          </Text>
        </Card.Header>

        <Card.Footer padded>
          <YStack space="$4" ai="center">
            <Input
              width={315}
              placeholder="추가할 자녀 ID 입력"
              keyboardType="numeric"
              value={childrenId}
              onChangeText={setChildrenId}
              editable={!loading}
            />

            <Button
              width={315}
              size="$5"
              onPress={addChild}
              disabled={loading}
              theme="active"
            >
              {loading ? (
                <>
                  <Spinner size="small" mr="$2" />
                  <Text>처리 중…</Text>
                </>
              ) : (
                <Text>자녀 추가</Text>
              )}
            </Button>
          </YStack>
        </Card.Footer>
      </Card>
    </YStack>
  )
}