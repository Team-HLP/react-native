import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Dimensions, ScrollView } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Card, Paragraph, Text, XStack, YStack } from 'tamagui'
import api from '../api/api'

const { width } = Dimensions.get('window')

const statusMap = { '위험': 1, '주의': 2, '정상': 3 }
const severityMap = { '정상': 0, '주의': 1, '위험': 2 }
const statusColor = {
  '정상': '#00b894',
  '주의': '#e17055',
  '위험': '#d63031',
}

export default function ChildTrendScreen({ navigation, route }) {
  const insets = useSafeAreaInsets()
  const { childrenId } = route.params

  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/guardian/children/${childrenId}/statistics`)
        setStats(data)
      } catch (e) {
        setError(
          e.response?.status === 404
            ? '통계 내역이 없습니다.'
            : '전체 통계를 불러오는 중 오류가 발생했습니다.'
        )
      } finally {
        setLoading(false)
      }
    })()
  }, [childrenId])

  const labels = stats.map((_, i) => `#${i + 1}`)
  const conc = stats.map(s => s.concentration_score)
  const impl = stats.map(s => s.impulse_inhibition_score)
  const sev = stats.map(s => severityMap[s.adhd_status])

  const counts = { '정상': 0, '주의': 0, '위험': 0 }
  stats.forEach(s => { if (counts[s.adhd_status] !== undefined) counts[s.adhd_status]++ })

  const { insightSummary, trendMessage } = useMemo(() => {
    const maxLabel = Object.entries(counts).reduce((a, b) => (a[1] >= b[1] ? a : b))[0]
    const insightSummary = `대체로 ${maxLabel} 수준입니다.`

    let consecutiveRiskCount = 0
    for (let i = sev.length - 1; i >= 0; i--) {
      if (sev[i] === 2) consecutiveRiskCount++
      else break
    }

    let trendMessage = ''
    if (consecutiveRiskCount >= 3) {
      trendMessage = `최근 ${consecutiveRiskCount}회 연속 위험 상태입니다.`
    } else if (sev.length >= 3) {
      const [a, b, c] = sev.slice(-3)
      if (a < b && b < c) trendMessage = '최근 상태가 악화되고 있습니다.'
      else if (a > b && b < c) trendMessage = '최근 상태가 호전되고 있습니다.'
    }

    if (!trendMessage && sev.length > 1) {
      const first = sev[0], last = sev[sev.length - 1]
      if (last > first) trendMessage = '최근 위험도가 상승하는 경향이 있습니다.'
      else if (last < first) trendMessage = '최근 상태가 점차 개선되고 있습니다.'
      else trendMessage = '큰 변화 없이 일정한 상태를 유지 중입니다.'
    }

    return { insightSummary, trendMessage }
  }, [sev])

  if (loading) {
    return (
      <YStack f={1} jc="center" ai="center" bg="$background">
        <ActivityIndicator size="large" />
      </YStack>
    )
  }

  if (error || !stats.length) {
    return (
      <YStack f={1} jc="center" ai="center" bg="$background" p="$4">
        <Text>{error}</Text>
        <Button onPress={() => navigation.goBack()} mt="$2">
          <Text>뒤로</Text>
        </Button>
      </YStack>
    )
  }

  return (
    <YStack f={1} bg="$background">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <Text fontSize="$7" fontWeight="800" ta="center" mb="$2">
          전체 세션별 ADHD 점수 추이
        </Text>

        <LineChart
          data={{
            labels,
            datasets: [
              { data: conc, color: () => '#4f8cff', strokeWidth: 2 },
              { data: impl, color: () => '#00c176', strokeWidth: 2 },
            ],
            legend: ['집중력', '충동억제'],
          }}
          width={width - 32}
          height={260}
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 1,
            color: () => '#000',
            labelColor: () => '#888',
            propsForDots: { r: '4', strokeWidth: '2', stroke: '#fff' },
            propsForBackgroundLines: { stroke: '#eee' },
          }}
          bezier
          style={{ borderRadius: 16, marginBottom: 32 }}
        />

        <Card bg="$gray1" p="$4" borderRadius="$4" mb="$4" elevate>
          <Text fontSize="$6" fontWeight="700" mb="$2">상태 인사이트 요약</Text>
          <Paragraph mb="$1">{insightSummary}</Paragraph>
          <Paragraph>{trendMessage}</Paragraph>
        </Card>

        <Text fontSize="$6" fontWeight="700" mb="$2">세션별 상태</Text>
        <YStack gap="$2" mb="$6">
          {stats.map((s, i) => (
            <Card key={i} p="$3" bordered bg="$gray2" borderRadius="$4">
              <XStack jc="space-between" ai="center">
                <Text fontSize="$4">세션 {i + 1}</Text>
                <Text fontSize="$4" fontWeight="700" color={statusColor[s.adhd_status]}>
                  {s.adhd_status}
                </Text>
              </XStack>
            </Card>
          ))}
        </YStack>
      </ScrollView>

      <YStack px="$3" pb={insets.bottom + 16} bg="$background">
        <Button
          size="$5"
          backgroundColor="#gray5"
          color="$gray11"
          onPress={() => navigation.goBack()}
        >
          <Text>자녀 정보로</Text>
        </Button>
      </YStack>
    </YStack>
  )
}