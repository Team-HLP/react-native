// src/screens/ChildListScreen.jsx
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  Button,
  Card,
  ScrollView,
  Text,
  XStack,
  YStack,
} from 'tamagui'
import api from '../api/api'
import { removeToken } from '../utils/storage'

export default function ChildListScreen({ navigation }) {
  const [guardian, setGuardian] = useState(null)
  const [children, setChildren] = useState([])

  // 디바이스 안전 영역 insets 가져오기
  const insets = useSafeAreaInsets()

  const fetchData = async () => {
    try {
      const { data: guardData } = await api.post('/guardian/me')
      const { data: childrenData } = await api.get('/guardian/children')
      setGuardian(guardData)
      setChildren(
        childrenData
          .filter(c => c.name?.trim() && c.age != null)
          .filter((c, i, arr) => i === arr.findIndex(v => v.id === c.id))
      )
    } catch (e) {
      console.error(e)
      Alert.alert('오류', '데이터를 불러오는 중 문제가 발생했습니다.')
    }
  }

  // 화면에 포커스될 때마다 (뒤로 돌아오거나) 데이터 갱신
  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [])
  )

  const goToDetail = id => navigation.navigate('ChildDetail', { childrenId: id })

  const logout = async () => {
    await removeToken()
    Alert.alert('로그아웃 되었습니다.')
    navigation.replace('Login')
  }

  return (
    <YStack f={1} bg="$background" p="$4">
      {/* 헤더 */}
      <XStack jc="space-between" ai="center" mb="$4">
        <YStack>
          {guardian && (
            <Text fontSize="$5" color="$gray10" mb="$1">
              {guardian.name} 보호자님
            </Text>
          )}
          <Text fontSize="$7" fontWeight="bold">
            자녀 목록
          </Text>
        </YStack>
        <Button size="$3" chromeless color="$gray11" fontWeight="600" onPress={logout}>
          로그아웃
        </Button>
      </XStack>

      {/* 자녀 리스트 */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack space="$3">
          {children.map(child => (
            <Card
              key={child.id}
              p="$4"
              mb="$3"
              borderWidth={1}
              borderColor="$gray5"
              borderRadius="$6"
              backgroundColor="white"
              onPress={() => goToDetail(child.id)}
            >
              <Text fontSize="$6" fontWeight="600" mb="$2">
                {child.name}
              </Text>
              <XStack jc="space-between">
                <Text>성별 : {child.sex}</Text>
                <Text>나이 : {child.age}</Text>
              </XStack>
            </Card>
          ))}
        </YStack>
      </ScrollView>

      {/* 고정된 하단 버튼 (safe-area + 16px 띄워서 네비게이션 바로 위에 고정) */}
      <YStack
        position="absolute"
        left={0}
        right={0}
        bottom={insets.bottom + 16}
        px="$3"
      >
        <Button
          size="$5"
          backgroundColor="#A78BFA"
          color="white"
          onPress={() => navigation.navigate('AddChild')}
        >
          자녀 추가
        </Button>
      </YStack>
    </YStack>
  )
}