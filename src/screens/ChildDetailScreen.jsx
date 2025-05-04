// src/screens/ChildDetailScreen.jsx
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, SafeAreaView, ScrollView } from 'react-native'
import {
  Button,
  Card,
  Separator,
  Text,
  XStack,
  YStack,
} from 'tamagui'
import api from '../api/api'

export default function ChildDetailScreen({ navigation, route }) {
  const { childrenId } = route.params
  const [child, setChild] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadChildDetail = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get(`/guardian/children/${childrenId}`)
      setChild(res.data)
    } catch (e) {
      console.error(e)
      setError(
        e.response?.status === 404
          ? '해당 자녀 정보를 찾을 수 없습니다.'
          : '자녀 정보를 불러오는 중 오류가 발생했습니다.'
      )
    } finally {
      setLoading(false)
    }
  }, [childrenId])

  useEffect(() => {
    loadChildDetail()
  }, [loadChildDetail])

  if (loading) {
    return (
      <YStack f={1} jc="center" ai="center" bg="$background">
        <ActivityIndicator size="large" />
      </YStack>
    )
  }

  if (error) {
    return (
      <YStack f={1} jc="center" ai="center" bg="$background" p="$4">
        <Text color="$red10" fontSize="$5" ta="center" mb="$4">
          {error}
        </Text>
        <Button size="$4" onPress={loadChildDetail}>
          다시 시도
        </Button>
      </YStack>
    )
  }

  // 전화번호 포맷팅
  const raw = (child.phone_number || '').replace(/\D+/g, '')
  let formattedPhone = raw
  if (raw.length === 11) {
    formattedPhone = raw.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  } else if (raw.length === 10) {
    formattedPhone = raw.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  }

  return (
    <YStack f={1} bg="$background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        <YStack p="$5" space="$4">
          <Text fontSize="$9" fontWeight="900" ta="center" mb="$4">
            {child.name}
          </Text>
          <Separator />

          <Card elevate borderRadius="$6" p="$4" space="$4">
            <XStack jc="space-between">
              <Text color="$gray10">성별</Text>
              <Text fontWeight="600">{child.sex}</Text>
            </XStack>
            <XStack jc="space-between">
              <Text color="$gray10">나이</Text>
              <Text fontWeight="600">{child.age}</Text>
            </XStack>
            <XStack jc="space-between">
              <Text color="$gray10">전화번호</Text>
              <Text fontWeight="600">{formattedPhone}</Text>
            </XStack>
          </Card>
        </YStack>
      </ScrollView>

      <SafeAreaView
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'transparent',
        }}
      >
        <YStack p="$3" bg="$background">
          <Button
            size="$5"
            backgroundColor="$gray5"
            color="$gray11"
            onPress={() => navigation.goBack()}
          >
            뒤로가기
          </Button>
        </YStack>
      </SafeAreaView>
    </YStack>
  )
}