// src/screens/ChildTrendScreen.jsx
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Grid, LineChart, XAxis } from 'react-native-svg-charts'
import { Button, Text, YStack } from 'tamagui'
import api from '../api/api'

export default function ChildTrendScreen({ navigation, route }) {
  const insets = useSafeAreaInsets()
  const { childrenId } = route.params

  const [stats, setStats]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get(
          `/guardian/children/${childrenId}/statistics`
        )
        setStats(data)
        // 404인 경우에도 빈 배열로 처리하려면 아래처럼 분기해도 됩니다.
        // if (data && data.length === 0) setStats([])
      } catch (e) {
        console.error('통계 API 에러', e.response?.status, e.response?.data)
        if (e.response?.status === 404) {
          setStats([])
        } else {
          setError('전체 통계를 불러오는 중 오류가 발생했습니다.')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [childrenId])

  if (loading) {
    return (
      <YStack f={1} jc="center" ai="center" bg="$background">
        <ActivityIndicator size="large" />
      </YStack>
    )
  }

  // 에러 메시지 우선
  if (error) {
    return (
      <YStack f={1} jc="center" ai="center" bg="$background" p="$4">
        <Text color="$red10" fontSize="$5">{error}</Text>
        <Button onPress={() => navigation.goBack()}><Text>뒤로</Text></Button>
      </YStack>
    )
  }

  // 통계가 하나도 없으면
  if (stats.length === 0) {
    return (
      <YStack f={1} jc="center" ai="center" bg="$background" p="$4">
        <Text>통계 내역이 없습니다.</Text>
        <Button onPress={() => navigation.goBack()}><Text>뒤로</Text></Button>
      </YStack>
    )
  }

  // 차트용 숫자 배열
  const concentrationData = stats.map(item => item.concentration_score)
  const impulseData      = stats.map(item => item.impulse_inhibition_score)
  const sessionLabels    = stats.map((_, i) => `#${i + 1}`)

  return (
    <YStack f={1} bg="$background">
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 16,
        }}
      >
        <Text fontSize="$9" fontWeight="900" ta="center" mb="$4">
          전체 세션별 ADHD 점수 추이
        </Text>

        {/* 집중력 점수 차트 */}
        <Text fontSize="$7" fontWeight="700" mb="$2">
          집중력 점수
        </Text>
        <LineChart
          style={{ height: 200 }}
          data={concentrationData}
          svg={{ stroke: 'blue', strokeWidth: 2 }}
          contentInset={{ top: 20, bottom: 20 }}
          animate
        >
          <Grid />
        </LineChart>
        <XAxis
          style={{ marginTop: 4, height: 30 }}
          data={sessionLabels}
          formatLabel={(value, index) => sessionLabels[index]}
          contentInset={{ left: 10, right: 10 }}
          svg={{ fontSize: 10, fill: 'gray' }}
        />

        {/* 충동억제 점수 차트 */}
        <Text fontSize="$7" fontWeight="700" mt="$6" mb="$2">
          충동억제 점수
        </Text>
        <LineChart
          style={{ height: 200 }}
          data={impulseData}
          svg={{ stroke: 'green', strokeWidth: 2 }}
          contentInset={{ top: 20, bottom: 20 }}
          animate
        >
          <Grid />
        </LineChart>
        <XAxis
          style={{ marginTop: 4, height: 30 }}
          data={sessionLabels}
          formatLabel={(value, index) => sessionLabels[index]}
          contentInset={{ left: 10, right: 10 }}
          svg={{ fontSize: 10, fill: 'gray' }}
        />

        {/* ADHD 상태 나열(필요시 제거 가능) */}
        <Text fontSize="$7" fontWeight="700" mt="$6" mb="$2">
          세션별 상태
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {stats.map((item, idx) => (
            <Text key={idx} style={{ marginRight: 12, fontSize: 12 }}>
              #{idx + 1}: {item.adhd_status}
            </Text>
          ))}
        </View>

        {/* 뒤로 가기 */}
        <YStack mt="$6" ai="center">
          <Button onPress={() => navigation.goBack()}>
            <Text>뒤로 가기</Text>
          </Button>
        </YStack>
      </ScrollView>
    </YStack>
  )
}