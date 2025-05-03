import React, { useState } from 'react'
import { Alert } from 'react-native'
import { Button, Input, Text, YStack } from 'tamagui'
import api from '../api/api'
import PhoneAuth from '../components/PhoneAuth'

export default function SignupScreen({ navigation }) {
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [verified, setVerified] = useState(false)

  const signup = async () => {
    if (!verified) {
      Alert.alert('전화번호 인증 필요')
      return
    }

    try {
      await api.post('/guardian/register', {
        login_id: id,
        password: pw,
        name,
        phone_number: phone,
      })

      Alert.alert('회원가입 성공', '이제 로그인하세요.', [
        { text: '확인', onPress: () => navigation.replace('Login') },
      ])
    } catch (e) {
      console.log(e)
      Alert.alert('회원가입 실패', '입력 정보를 확인하세요.')
    }
  }

  return (
    <YStack f={1} jc="center" ai="center" bg="white" px="$8">
      <Text fontSize="$8" fontWeight="bold" mb="$8">
        회원가입
      </Text>

      <Input
        placeholder="ID"
        value={id}
        onChangeText={setId}
        width="100%"
        size="$4"
        mb="$3"
      />
      <Input
        placeholder="Password"
        secureTextEntry
        value={pw}
        onChangeText={setPw}
        width="100%"
        size="$4"
        mb="$3"
      />
      <Input
        placeholder="이름"
        value={name}
        onChangeText={setName}
        width="100%"
        size="$4"
        mb="$3"
      />
      <Input
        placeholder="전화번호"
        value={phone}
        onChangeText={setPhone}
        width="100%"
        size="$4"
        mb="$4"
      />

      <PhoneAuth phone={phone} onVerified={() => setVerified(true)} />

      <Button
        onPress={signup}
        backgroundColor="$blue10"
        width="100%"
        size="$4"
        mt="$6"
      >
        회원가입
      </Button>

      <Button
        onPress={() => navigation.replace('Login')}
        chromeless
        mt="$3"
        size="$3"
      >
        로그인으로 돌아가기
      </Button>
    </YStack>
  )
}