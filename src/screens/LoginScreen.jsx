import React, { useState } from 'react'
import { Alert } from 'react-native'
import { Button, Input, Text, YStack } from 'tamagui'
import api from '../api/api'
import { saveToken } from '../utils/storage'

export default function LoginScreen({ navigation }) {
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')

  const login = async () => {
    try {
      const res = await api.post('/guardian/login', {
        login_id: id,
        password: pw,
      })

      await saveToken(res.data.access_token)
      Alert.alert('로그인 성공')
      navigation.replace('ChildList')
    } catch (e) {
      console.log(e)
      Alert.alert('로그인 실패', '아이디나 비밀번호를 확인하세요.')
    }
  }

  return (
    <YStack f={1} jc="center" ai="center" space="$5" p="$6" bg="$background">
      <Text fontSize="$8" fontWeight="bold">로그인</Text>

      <Input
        placeholder="ID"
        value={id}
        onChangeText={setId}
        width="80%"
        size="$4"
      />

      <Input
        placeholder="Password"
        secureTextEntry
        value={pw}
        onChangeText={setPw}
        width="80%"
        size="$4"
      />

      <Button width="80%" onPress={login} size="$4">로그인</Button>
      <Button width="80%" onPress={() => navigation.navigate('Signup')} size="$4" theme="alt2">회원가입</Button>
    </YStack>
  )
}