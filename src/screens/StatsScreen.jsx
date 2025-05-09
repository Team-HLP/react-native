import { useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { Button, Card, Spinner, Text, YStack } from 'tamagui'
import api from '../api/api'

export default function StatsScreen({ navigation }) {
  const { params } = useRoute()
  const { childrenId, gameId } = params          // 네비게이터로부터 전달

  const [loading, setLoading]                       = useState(true)
  const [stats,   setStats]                         = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(
          `/guardian/children/${childrenId}/statistics/${gameId}`,
        )
        setStats(data)
      } catch (e) {
        console.error(e)
        Alert.alert('불러오기 실패', '서버 요청 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [childrenId, gameId])

  if (loading) {
    return (
      <YStack f={1} ai="center" jc="center">
        <Spinner size="large" />
      </YStack>
    )
  }

  if (!stats) {
    return (
      <YStack f={1} ai="center" jc="center">
        <Text>데이터가 없습니다.</Text>
        <Button mt="$4" onPress={() => navigation.goBack()}>
          <Text>뒤로가기</Text>
        </Button>
      </YStack>
    )
  }

  return (
    <YStack f={1} p="$4" space="$4">
      <Card p="$4" bordered elevate>
        <Text fontSize="$6" fontWeight="600" mb="$2">
          충동 억제 점수
        </Text>
        <Text fontSize="$9">{stats.impulse_inhibition_score}</Text>
      </Card>

      <Card p="$4" bordered elevate>
        <Text fontSize="$6" fontWeight="600" mb="$2">
          집중도 점수
        </Text>
        <Text fontSize="$9">{stats.concentration_score}</Text>
      </Card>

      <Card p="$4" bordered elevate>
        <Text fontSize="$6" fontWeight="600" mb="$2">
          ADHD 판정
        </Text>
        <Text fontSize="$7">{stats.adhdStatus}</Text>
      </Card>
    </YStack>
  )
}