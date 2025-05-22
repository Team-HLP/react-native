// src/screens/StatsScreen.jsx
import { useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Card, Text, YStack } from 'tamagui'
import api from '../api/api'

// ───── 점수 ProgressBar 카드 ─────
function ScoreBar({ label, value }) {
  const ratio = Math.min(Math.max(value, 0), 27) / 27
  const color =
    value >= 27 ? '#4ade80' :
    value >= 18 ? '#fbbf24' :
    '#f87171'

  return (
    <Card p="$4" bordered elevate>
      <Text color="$gray10" fontSize="$6" fontWeight="600" mb="$2">{label}</Text>
      <YStack>
        <YStack bg="#e5e7eb" h={16} br="$3" overflow="hidden">
          <YStack h="100%" w={`${ratio * 100}%`} bg={color} />
        </YStack>
        <Text mt="$2" fontSize="$6" fontWeight="700" ta="right">
          {value} / 27
        </Text>
      </YStack>
    </Card>
  )
}

// ───── 상태 배지 카드 (이모지 제거 + 뱃지 스타일) ─────
function StatusBadge({ status, score }) {
  const derived =
    score >= 27 ? '정상' :
    score >= 18 ? '주의' :
    '위험'

  const finalStatus = status || derived

  const map = {
    정상: { color: '#4ade80', label: '정상' },
    주의: { color: '#fbbf24', label: '주의 필요' },
    위험: { color: '#f87171', label: '높은 위험' },
  }

  const info = map[finalStatus] ?? { color: '#6b7280', label: '알 수 없음' }

  return (
    <Card p="$5" elevate ai="center" jc="center">
      <Text fontSize="$6" color="$gray10" mb="$2">
        현재 상태
      </Text>
      <YStack
        px="$4"
        py="$2"
        bg={info.color}
        br="$4"
        ai="center"
        jc="center"
      >
        <Text fontSize="$6" fontWeight="700" color="white">
          {info.label}
        </Text>
      </YStack>
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

      {/* 본문: 점수 카드 + 상태 배지 */}
      <YStack f={1} p="$4" space="$4">
        <ScoreBar    label="충동 억제" value={stats.impulse} />
        <ScoreBar    label="집중도"     value={stats.concentration} />
        <StatusBadge status={stats.status} score={stats.impulse} />
      </YStack>

      {/* 하단 버튼 */}
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