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
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 페이징 관련 상태
  const pageSizeOptions = [5, 10, 20]
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  // 상태별 카드 배경색 매핑
  const statusBg = {
    정상: '$green3',
    주의: '$yellow3',
    위험: '$red3',
  }

  // 자녀 상세 로드
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

  // 세션 목록 로드
  const loadSessions = useCallback(async () => {
    try {
      const { data } = await api.get(
        `/guardian/children/${childrenId}/games`
      )
      const mapped = data.map(item => ({
        gameId:     item.game_id,
        index:      item.index,
        adhdStatus: item.adhd_status,
        playedAt:   item.created_at,
      }))
      setSessions(mapped)
    } catch (e) {
      if (e.response?.status === 404) {
        setSessions([])
      } else {
        console.error(e)
      }
    }
  }, [childrenId])

  useEffect(() => {
    loadChildDetail()
    loadSessions()
  }, [loadChildDetail, loadSessions])

  // 로딩 & 에러 화면 처리
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

  // 전화번호 포맷
  const raw = (child.phone_number || '').replace(/\D+/g, '')
  const formattedPhone =
    raw.length === 11
      ? raw.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
      : raw.length === 10
      ? raw.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
      : raw

  // 날짜 내림차순 정렬
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.playedAt) - new Date(a.playedAt)
  )

  // 페이징 계산
  const totalPages = Math.ceil(sortedSessions.length / pageSize) || 1
  const pagedSessions = sortedSessions.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  return (
    <YStack f={1} bg="$background">
      {/* 스크롤 영역: footer 위까지만 */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      >
        <YStack p="$5" space="$4">
          {/* 자녀 이름 */}
          <Text fontSize="$9" fontWeight="900" ta="center" mb="$4">
            {child.name}
          </Text>
          <Separator />

          {/* 기본 정보 카드 */}
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

          {/* 세션 조회 헤더 */}
          <Text fontSize="$8" fontWeight="800" mt="$6" mb="$2">
            세션 조회
          </Text>

          {/* 페이지 크기 선택 */}
          <XStack space="$2" mb="$2" ai="center">
            <Text>페이지당:</Text>
            {pageSizeOptions.map(size => (
              <Button
                key={size}
                size="$3"
                theme={pageSize === size ? 'primary' : 'alt2'}
                onPress={() => {
                  setPageSize(size)
                  setPage(1)
                }}
              >
                <Text color={pageSize === size ? 'white' : '$color'}>
                  {size}
                </Text>
              </Button>
            ))}
          </XStack>

          {/* 페이징된 세션 리스트 */}
          {pagedSessions.length === 0 ? (
            <Text color="$gray9">플레이한 세션이 없습니다.</Text>
          ) : (
            pagedSessions.map(s => (
              <Card
                key={s.gameId}
                p="$4"
                mb="$2"
                bordered
                elevate
                backgroundColor={statusBg[s.adhdStatus] || '$background'}
                onPress={() =>
                  navigation.navigate('Stats', {
                    childrenId,
                    gameId: s.gameId,
                  })
                }
              >
                <XStack jc="space-between" ai="center">
                  <Text fontWeight="700" fontSize="$6">
                    Session #{s.index}
                  </Text>
                  <Text color="$gray9">{s.playedAt}</Text>
                </XStack>
                <Text mt="$2">ADHD 상태: {s.adhdStatus}</Text>
              </Card>
            ))
          )}

          {/* 페이지 네비게이션 */}
          {sortedSessions.length > 0 && (
            <XStack jc="center" ai="center" space="$3" mt="$2">
              <Button
                size="$3"
                disabled={page === 1}
                onPress={() => setPage(p => Math.max(p - 1, 1))}
              >
                <Text>이전</Text>
              </Button>
              <Text>
                {page} / {totalPages} 페이지
              </Text>
              <Button
                size="$3"
                disabled={page === totalPages}
                onPress={() =>
                  setPage(p => Math.min(p + 1, totalPages))
                }
              >
                <Text>다음</Text>
              </Button>
            </XStack>
          )}
        </YStack>
      </ScrollView>

      {/* 고정 Footer: 뒤로 가기 */}
      <YStack px="$3" pb={insets.bottom + 16} bg="$background">
        <Button
          size="$5"
          backgroundColor="#gray5"
          color="$gray11"
          onPress={() => navigation.goBack()}
        >
          <Text>자녀 목록으로</Text>
        </Button>
      </YStack>
    </YStack>
  )
}