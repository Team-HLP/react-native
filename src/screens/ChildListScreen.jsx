import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import {
  Button,
  Card,
  H6,
  Paragraph,
  ScrollView,
  Separator,
  Text,
  XStack,
  YStack,
} from 'tamagui'
import api from '../api/api'
import { removeToken } from '../utils/storage'

export default function ChildListScreen({ navigation }) {
  const [children, setChildren] = useState([])

  /* ───────── 데이터 ───────── */
  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await api.get('/guardian/children')
        setChildren(
          data
            .filter(c => c.name?.trim() && c.age != null)
            .filter((c, i, arr) => i === arr.findIndex(v => v.id === c.id))
        )
      } catch (e) {
        console.log(e)
        Alert.alert('오류', '자녀 정보를 불러오는 중 문제가 발생했습니다.')
      }
    })()
  }, [])

  const goToDetail = id => navigation.navigate('ChildDetail', { childrenId: id })

  const logout = async () => {
    await removeToken()
    Alert.alert('로그아웃 되었습니다.')
    navigation.replace('Login')
  }

  /* ───────── UI ───────── */
  return (
    <YStack f={1} p="$4" space="$4" bg="$background">
      
      {/* Header with Logout */}
      <XStack jc="space-between" ai="center">
        <Text fontSize="$7" fontWeight="bold">
          자녀 목록
        </Text>
        <Button size="$3" chromeless onPress={logout}>
          로그아웃
        </Button>
      </XStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack space="$3">
          {children.map(child => (
            <Card
              key={child.id}
              size="$4"
              borderWidth={1}
              borderColor="$gray5"
              borderRadius="$6"
              pressStyle={{ bg: '$gray2' }}
              onPress={() => goToDetail(child.id)}
            >
              <Card.Header padded>
                <H6>{child.name}</H6>
              </Card.Header>

              <Separator />

              <Card.Footer padded>
                <XStack jc="space-between">
                  <Paragraph>성별 : {child.sex}</Paragraph>
                  <Paragraph>나이 : {child.age}</Paragraph>
                </XStack>
              </Card.Footer>
            </Card>
          ))}
        </YStack>
      </ScrollView>

      <Button size="$5" mt="$4" onPress={() => navigation.navigate('AddChild')}>
        자녀 추가
      </Button>
    </YStack>
  )
}