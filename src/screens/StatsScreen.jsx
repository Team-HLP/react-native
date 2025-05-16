// src/screens/StatsScreen.jsx
import { useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Card, Spinner, Text, YStack } from 'tamagui'
import api from '../api/api'

export default function StatsScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { params } = useRoute()
  const { childrenId, gameId } = params

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get(
          `/guardian/children/${childrenId}/statistics/${gameId}`
        )
        // snake_case → camelCase 매핑
        setStats({
          impulseInhibitionScore: data.impulse_inhibition_score,
          concentrationScore: data.concentration_score,
          adhdStatus: data.adhd_status,
        })
      } catch (e) {
        console.error(e)
        Alert.alert('불러오기 실패', '서버 요청 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [childrenId, gameId])

  if (loading) {
    return (
      <YStack f={1} ai="center" jc="center" bg="$background">
        <Spinner size="large" />
      </YStack>
    )
  }

  if (!stats) {
    return (
      <YStack f={1} ai="center" jc="center" bg="$background" p="$4">
        <Text fontSize="$5">데이터가 없습니다.</Text>
        <Button mt="$4" onPress={() => navigation.goBack()}>
          <Text>뒤로 가기</Text>
        </Button>
      </YStack>
    )
  }

  return (
    <YStack f={1} bg="$background">
      {/* 상단 타이틀 */}
      <YStack
        ai="center"
        jc="center"
        pt={Platform.select({ ios: 60, android: 20 })}
        pb="$3"
        bg="$background"
      >
        <Text fontSize="$7" fontWeight="700">
          ADHD 통계
        </Text>
      </YStack>

      {/* 점수 카드들 */}
      <YStack f={1} p="$4" space="$4">
        <Card
          p="$5"
          borderRadius="$8"
          elevation="$3"
          backgroundColor="white"
        >
          <Text fontSize="$6" fontWeight="600" mb="$2">
            충동 억제 점수
          </Text>
          <Text fontSize="$9" fontWeight="700">
            {stats.impulseInhibitionScore}
          </Text>
        </Card>

        <Card
          p="$5"
          borderRadius="$8"
          elevation="$3"
          backgroundColor="white"
        >
          <Text fontSize="$6" fontWeight="600" mb="$2">
            집중도 점수
          </Text>
          <Text fontSize="$9" fontWeight="700">
            {stats.concentrationScore}
          </Text>
        </Card>

        <Card
          p="$5"
          borderRadius="$8"
          elevation="$3"
          backgroundColor="white"
        >
          <Text fontSize="$6" fontWeight="600" mb="$2">
            ADHD 판정
          </Text>
          <Text fontSize="$7" fontWeight="700">
            {stats.adhdStatus}
          </Text>
        </Card>
      </YStack>

      {/* 뒤로가기 버튼 (하단 고정) */}
      <YStack
        position="absolute"
        bottom={insets.bottom + 16}
        left={0}
        right={0}
        px="$3"
        bg="$background"
      >
        <Button
          size="$5"
          backgroundColor="#gray5"
          color="$gray11"
          onPress={() => navigation.goBack()}
        >
          <Text>뒤로 가기</Text>
        </Button>
      </YStack>
    </YStack>
  )
}