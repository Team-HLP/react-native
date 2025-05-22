// src/screens/StatsScreen.jsx
import { useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ProgressCircle } from 'react-native-svg-charts'
import { Button, Card, Text, XStack, YStack } from 'tamagui'
import api from '../api/api'

// ───── 게이지 카드 ─────
function ScoreGauge({ label, value }) {
  // 0~27 범위로 클램핑 후 0~1 비율로 변환
  const ratio = Math.min(Math.max(value, 0), 27) / 27
  // 색상 기준도 27 기준으로 변경
  const color =
    value >= 27 ? '#4ade80' :
    value >= 18 ? '#fbbf24' :
    '#f87171'

  return (
    <Card p="$4" bordered elevate height={230} ai="center" jc="center">
      <Text color="$gray10" fontSize="$6" fontWeight="600" mb="$3">
        {label}
      </Text>
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

// ───── 상태 배지 ─────
function StatusBadge({ status, score }) {
  // 상태 문자열이 없을 때 점수 기준(27 기준)으로 파생
  const derived =
    score >= 27 ? '정상' :
    score >= 18 ? '주의' :
    '위험'

  const finalStatus = status || derived

  const map = {
    정상: { color: '#4ade80', icon: '👍' },
    주의: { color: '#fbbf24', icon: '⚠️' },
    위험: { color: '#f87171', icon: '⛔' },
  }

  const info = map[finalStatus] ?? { color: '#6b7280', icon: '❔' }
  const { color, icon } = info

  return (
    <Card p="$5" elevate ai="center" jc="center">
      <XStack ai="center" space="$2">
        <Text fontSize="$7" fontWeight="700" color={color}>
          {icon} {finalStatus}
        </Text>
      </XStack>
    </Card>
  )
}

export default function StatsScreen({ navigation }) {
  const { params } = useRoute()
  const { childrenId, gameId } = params
  const insets = useSafeAreaInsets()

  const [loading, setLoading] = useState(true)
  const [stats,   setStats]   = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await api.get(
          `/guardian/children/${childrenId}/statistics/${gameId}`
        )
        setStats({
          impulse:       data.impulse_inhibition_score,
          concentration: data.concentration_score,
          status:        data.adhd_status,
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

      {/* 본문: 게이지 두 개 + 상태 배지 */}
      <YStack f={1} p="$4" space="$4">
        <ScoreGauge   label="충동 억제" value={stats.impulse} />
        <ScoreGauge   label="집중도"     value={stats.concentration} />
        <StatusBadge  status={stats.status} score={stats.impulse} />
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
          <Text>자녀 정보로</Text>
        </Button>
      </YStack>
    </YStack>
  )
}