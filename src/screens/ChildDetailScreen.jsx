import React, { useCallback, useEffect, useState } from 'react'
import {
  Card,
  Separator,
  Spinner,
  Text,
  XStack,
  YStack
} from 'tamagui'
import api from '../api/api'

export default function ChildDetailScreen({ route }) {
  const { childrenId } = route.params
  const [child, setChild] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadChildDetail = useCallback(async () => {
    try {
      const res = await api.get(`/guardian/children/${childrenId}`)
      setChild(res.data)
    } catch (e) {
      console.log(e)
      if (e.response?.status === 404) {
        setError('해당 자녀 정보를 찾을 수 없습니다.')
      } else {
        setError('자녀 정보를 불러오는 중 오류가 발생했습니다.')
      }
    } finally {
      setLoading(false)
    }
  }, [childrenId])

  useEffect(() => {
    loadChildDetail()
  }, [loadChildDetail])

  if (loading) {
    return (
      <YStack f={1} jc="center" ai="center">
        <Spinner size="large" />
      </YStack>
    )
  }

  if (error) {
    return (
      <YStack f={1} jc="center" ai="center" p="$4">
        <Text color="$red10" fontSize="$5" textAlign="center">
          {error}
        </Text>
      </YStack>
    )
  }

  return (
    <YStack f={1} p="$5" space="$5" bg="$background">
      <Card bordered size="$5" padding="$5" space="$5">

        <Text fontSize="$7" fontWeight="bold" textAlign="center">
          {child.name}
        </Text>

        <Separator />

        <YStack space="$4">
          <XStack space="$2">
            <Text color="$gray10" width={80}>성별</Text>
            <Text>{child.sex}</Text>
          </XStack>

          <XStack space="$2">
            <Text color="$gray10" width={80}>나이</Text>
            <Text>{child.age}</Text>
          </XStack>

          <XStack space="$2">
            <Text color="$gray10" width={80}>전화번호</Text>
            <Text>{child.phone_number}</Text>
          </XStack>
        </YStack>
      </Card>
    </YStack>
  )
}