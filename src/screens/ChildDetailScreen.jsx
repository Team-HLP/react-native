// src/screens/ChildDetailScreen.jsx
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
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
  const insets = useSafeAreaInsets()
  const { childrenId } = route.params

  const [child, setChild] = useState(null)
  const [sessions, setSessions] = useState([])   // 세션 목록
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  /* ───────── 자녀 상세 ───────── */
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

  /* ───────── 세션 목록 ───────── */
  const loadSessions = useCallback(async () => {
    try {
      const { data } = await api.get(
        `/guardian/children/${childrenId}/games`,   // 실제 엔드포인트에 맞게 수정
      )
      setSessions(data)                            // 정상 응답(200)
    } catch (e) {
      if (e.response?.status === 404) {
        // 세션이 없을 때 → 빈 배열로 처리
        setSessions([])
      } else {
        console.error(e)
      }
    }
  }, [childrenId])

  /* ───────── 초기 로드 ───────── */
  useEffect(() => {
    loadChildDetail()
    loadSessions()
  }, [loadChildDetail, loadSessions])

  /* ───────── 상태별 화면 ───────── */
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
          <Text>다시 시도</Text>
        </Button>
      </YStack>
    )
  }

  /* ───────── 전화번호 포맷 ───────── */
  const raw = (child.phone_number || '').replace(/\D+/g, '')
  const formattedPhone =
    raw.length === 11 ? raw.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
      : raw.length === 10 ? raw.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
        : raw

  /* ───────── 세션 정렬 (날짜 ↓) ───────── */
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.playedAt) - new Date(a.playedAt),
  )

  return (
    <YStack f={1} bg="$background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        <YStack p="$5" space="$4">
          <Text fontSize="$9" fontWeight="900" ta="center" mb="$4">
            {child.name}
          </Text>
          <Separator />

          {/* ─── 기본 정보 ─── */}
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

          {/* ─── 세션별 점수 리스트 ─── */}
          <Text fontSize="$8" fontWeight="800" mt="$6" mb="$2">
            세션 조회
          </Text>

          {sortedSessions.length === 0 && (
            <Text color="$gray9">플레이한 세션이 없습니다.</Text>
          )}

          {sortedSessions.map(s => (
            <Card
              key={s.gameId}
              p="$4"
              mb="$2"
              bordered
              elevate
              onPress={() =>
                navigation.navigate('Stats', {
                  childrenId,
                  gameId: s.gameId,
                })
              }
            >
              <XStack jc="space-between" ai="center">
                <Text fontWeight="700" fontSize="$6">
                  {s.gameName ?? `Game #${s.gameId}`}
                </Text>
                <Text color="$gray9">
                  {s.playedAt?.slice(0, 10)}
                </Text>
              </XStack>
            </Card>
          ))}
        </YStack>
      </ScrollView>

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
          backgroundColor="$gray5"
          color="$gray11"
          onPress={() => navigation.goBack()}
        >
          <Text>뒤로 가기</Text>
        </Button>
      </YStack>
    </YStack>
  )
}