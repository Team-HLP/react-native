// src/screens/ChildListScreen.jsx
import React, { useEffect, useState } from 'react'
import { Alert, SafeAreaView } from 'react-native'
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

  useEffect(() => {
    // 보호자 정보와 자녀 목록을 동시에 불러옵니다
    ; (async () => {
      try {
        const [{ data: guardData }, { data: childrenData }] = await Promise.all([
          // ↓ POST로 변경
          api.post('/guardian/me'),
          api.get('/guardian/children'),
        ])
        setGuardian(guardData)
        setChildren(
          childrenData
            .filter(c => c.name?.trim() && c.age != null)
            .filter((c, i, arr) => i === arr.findIndex(v => v.id === c.id))
        )
      } catch (e) {
        console.log(e)
        Alert.alert('오류', '데이터를 불러오는 중 문제가 발생했습니다.')
      }
    })()
  }, [])

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

      {/* 고정된 하단 버튼 */}
      <SafeAreaView
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <YStack p="$3" bg="$background">
          <Button
            size="$5"
            backgroundColor="#A78BFA"
            color="white"
            onPress={() => navigation.navigate('AddChild')}
          >
            자녀 추가
          </Button>
        </YStack>
      </SafeAreaView>
    </YStack>
  )
}