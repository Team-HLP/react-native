import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from '@tamagui/linear-gradient'
import { MotiView } from 'moti'
import React, { useState } from 'react'
import { Alert } from 'react-native'
import { Easing } from 'react-native-reanimated'
import { Button, Card, Input, Text, YStack } from 'tamagui'
import api from '../api/api'
import PhoneAuth from '../components/PhoneAuth'
import { gradientBluePurple, gradientPurplePink, gradientTealBlue } from '../utils/colors'

function Bubble({ size, delay, fromXY, toXY, colors }) {
  return (
    <MotiView
      position="absolute"
      style={{ width: size, height: size }}
      from={{ ...fromXY, opacity: 0.4 }}
      animate={{ ...toXY, opacity: 0.4 }}
      transition={{
        loop: true,
        type: 'timing',
        easing: Easing.inOut(Easing.ease),
        duration: 20000,
        delay,
      }}
    >
      <YStack
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        borderRadius={size / 2}
        overflow="hidden"
      >
        <LinearGradient f={1} colors={colors} start={[0, 0]} end={[1, 1]} />
      </YStack>
    </MotiView>
  )
}
// 전화번호 포맷터 함수 추가
function formatPhoneNumber(value) {
  // 숫자만 추출
  const cleaned = value.replace(/\D+/g, '')

  if (cleaned.length < 4) return cleaned
  if (cleaned.length < 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
  if (cleaned.length < 11) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`
}

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
    <YStack f={1} jc="center" ai="center" bg="$background" p="$3">
      {/* 비눗방울 */}
      <Bubble
        size={400}
        delay={0}
        fromXY={{ translateX: -160, translateY: -140 }}
        toXY={{ translateX: 160, translateY: 120 }}
        colors={gradientBluePurple}
      />
      <Bubble
        size={300}
        delay={2000}
        fromXY={{ translateX: 160, translateY: -180 }}
        toXY={{ translateX: -160, translateY: 140 }}
        colors={gradientTealBlue}
      />
      <Bubble
        size={220}
        delay={4000}
        fromXY={{ translateX: -140, translateY: 200 }}
        toXY={{ translateX: 140, translateY: -160 }}
        colors={gradientPurplePink}
      />

      {/* 회원가입 카드 */}
      <Card bordered elevate size="$5" w="90%" maw={420} p="$6" space="$6">
        <MaskedView
          style={{ height: 70, alignSelf: 'stretch' }}
          maskElement={
            <YStack f={1} jc="center" ai="center">
              <Text fontSize="$9" fontWeight="900" letterSpacing={1}>
                회원가입
              </Text>
            </YStack>
          }
        >
          <LinearGradient f={1} colors={gradientBluePurple} start={[0, 0]} end={[1, 1]} />
        </MaskedView>

        <YStack ai="stretch" space="$4">
          <Input placeholder="ID" value={id} onChangeText={setId} size="$4" />
          <Input placeholder="Password" secureTextEntry value={pw} onChangeText={setPw} size="$4" />
          <Input placeholder="이름" value={name} onChangeText={setName} size="$4" />
          <Input
            placeholder="전화번호"
            value={phone}
            onChangeText={(text) => setPhone(formatPhoneNumber(text))}
            size="$4"
          />

          <PhoneAuth phone={phone} onVerified={() => setVerified(true)} />

          <Button
            onPress={signup}
            size="$4"
            mt="$4"
            animation={{ type: 'spring', damping: 14, mass: 0.6, stiffness: 180 }}
            pressStyle={{ scale: 0.96, y: 2 }}
          >
            회원가입
          </Button>

          <Button
            onPress={() => navigation.replace('Login')}
            chromeless
            size="$3"
            mt="$2"
          >
            로그인으로 돌아가기
          </Button>
        </YStack>
      </Card>
    </YStack>
  )
}