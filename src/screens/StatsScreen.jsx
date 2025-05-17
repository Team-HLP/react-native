// src/screens/StatsScreen.jsx
import { useRoute } from '@react-navigation/native'
import { Info } from '@tamagui/lucide-icons'
import React, { useEffect, useState } from 'react'
import { Alert, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ProgressCircle } from 'react-native-svg-charts'
import { Button, Card, Popover, Text, XStack, YStack } from 'tamagui'
import api from '../api/api'

/* ───── 점수 범위 툴팁 ───── */
function RangePopover() {
  return (
    <Popover placement="top" size="$4">
      <Popover.Trigger asChild>
        <Info size={18} color="#6b7280" />
      </Popover.Trigger>

      <Popover.Content p="$3" borderRadius="$4" elevate>
        <YStack space="$1">
          <Text fontWeight="700">점수 기준</Text>
          <Text color="#4ade80">정상 · 36 이상</Text>
          <Text color="#fbbf24">주의 · 18 ‒ 35</Text>
          <Text color="#f87171">위험 · 0 ‒ 17</Text>
        </YStack>
      </Popover.Content>
    </Popover>
  )
}

/* ───── 게이지 카드 ───── */
function ScoreGauge({ label, value }) {
  const ratio = Math.min(Math.max(value, 0), 36) / 36
  const color =
    value >= 36 ? '#4ade80' : value >= 18 ? '#fbbf24' : '#f87171'

  return (
    <Card p="$4" bordered elevate height={230} ai="center" jc="center">
      {/* 제목 + 툴팁 아이콘 */}
      <XStack jc="space-between" ai="center" w="100%" mb="$3">
        <Text fontSize="$6" fontWeight="600">{label}</Text>
        <RangePopover />
      </XStack>

      {/* 게이지 */}
      <YStack ai="center" jc="center">
        <ProgressCircle
          style={{ height: 150, width: 150 }}
          progress={ratio}
          strokeWidth={10}
          progressColor={color}
          backgroundColor="#e5e7eb"
        />
        <Text position="absolute" fontSize="$8" fontWeight="700">
          {value}
        </Text>
      </YStack>
    </Card>
  )
}

/* ───── 상태 배지 ───── */
function StatusBadge({ status, score }) {
  // score(0~36) → status 문자열이 없을 때 자동 계산
  const derived =
    score >= 36 ? '양호'
      : score >= 18 ? '주의'
        : '위험'

  const finalStatus = status || derived

  const map = {
    양호: { color: '#4ade80', icon: '👍' },
    주의: { color: '#fbbf24', icon: '⚠️' },
    위험: { color: '#f87171', icon: '⛔' },
  }

  const { color, icon } = map[finalStatus]

  return (
    <Card p="$5" elevate ai="center" jc="center">
      <Text fontSize="$7" fontWeight="700" color={color}>
        {icon}  {finalStatus}
      </Text>
    </Card>
  )
}

export default function StatsScreen({ navigation }) {
  const { params } = useRoute()
  const { childrenId, gameId } = params
  const insets = useSafeAreaInsets()

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(
          `/guardian/children/${childrenId}/statistics/${gameId}`,
        )
        setStats({
          impulse: data.impulse_inhibition_score,
          concentration: data.concentration_score,
          status: data.adhd_status,
        })
      } catch (e) {
        console.error(e)
        Alert.alert('불러오기 실패', '서버 요청 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    })()
  }, [childrenId, gameId])

  if (loading) {
    return (
      <YStack f={1} ai="center" jc="center" bg="$background">
        <Text>로딩 중…</Text>
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
      {/* 타이틀 */}
      <YStack
        ai="center"
        jc="center"
        pt={Platform.select({ ios: 60, android: 20 })}
        pb="$3"
      >
        <Text fontSize="$7" fontWeight="700">ADHD 통계</Text>
      </YStack>

      {/* 본문 */}
      <YStack f={1} p="$4" space="$4">
        <ScoreGauge label="충동 억제" value={stats.impulse} />
        <ScoreGauge label="집중도" value={stats.concentration} />
        <StatusBadge status={stats.status} />
      </YStack>

      {/* 뒤로가기 버튼 */}
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