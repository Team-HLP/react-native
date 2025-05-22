// src/screens/LoginScreen.jsx

import { LinearGradient } from '@tamagui/linear-gradient'
import { MotiView } from 'moti'
import React, { useState } from 'react'
import { Alert, Image } from 'react-native'
import { Easing } from 'react-native-reanimated'
import {
  Button,
  Card,
  Input,
  Text,
  YStack,
} from 'tamagui'
import api from '../api/api'
import { gradientBluePurple, gradientPurplePink, gradientTealBlue } from '../utils/colors'
import { saveToken } from '../utils/storage'

/* ───── 비눗방울 컴포넌트 ───── */
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
        {/* 메인 그라데이션 */}
        <LinearGradient f={1} colors={colors} start={[0, 0]} end={[1, 1]} />

        {/* 반짝임 효과 */}
        <MotiView
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderRadius: size / 2,
          }}
          from={{ opacity: 0.2, scale: 1 }}
          animate={{ opacity: 0.6, scale: 1.2 }}
          transition={{
            loop: true,
            type: 'timing',
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            delay: delay + 1000,
          }}
        />
      </YStack>
    </MotiView>
  )
}

export default function LoginScreen({ navigation }) {
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')

  async function login() {
    try {
      const { data } = await api.post('/guardian/login', {
        login_id: id,
        password: pw,
      })
      await saveToken(data.access_token)
      navigation.replace('ChildList')
    } catch {
      Alert.alert('로그인 실패', '아이디나 비밀번호를 확인하세요.')
    }
  }

  return (
    <YStack f={1} jc="center" ai="center" bg="$background" p="$3">
      {/* 비눗방울 애니메이션 */}
      <Bubble
        size={420}
        delay={0}
        fromXY={{ translateX: -180, translateY: -160, rotate: '0deg' }}
        toXY={{ translateX: 160, translateY: 100, rotate: '360deg' }}
        colors={gradientBluePurple}
      />
      <Bubble
        size={300}
        delay={3000}
        fromXY={{ translateX: 160, translateY: -200, rotate: '0deg' }}
        toXY={{ translateX: -140, translateY: 150, rotate: '-360deg' }}
        colors={gradientTealBlue}
      />
      <Bubble
        size={220}
        delay={6000}
        fromXY={{ translateX: -170, translateY: 200, rotate: '0deg' }}
        toXY={{ translateX: 180, translateY: -150, rotate: '360deg' }}
        colors={gradientPurplePink}
      />

      {/* 로그인 카드 */}
      <Card bordered elevate size="$5" w="90%" maw={420} p="$6" space="$6">
        {/* 상단 로고 */}
        <Image
          source={require('../../assets/images/logo.png')}
          style={{
            width: 600,
            height: 200,
            resizeMode: 'contain',
            alignSelf: 'center',
            marginBottom: -30,
          }}
        />

        {/* 입력 필드 */}
        <YStack ai="stretch" space="$4">
          <Input size="$4" placeholder="ID" value={id} onChangeText={setId} />
          <Input
            size="$4"
            placeholder="Password"
            secureTextEntry
            value={pw}
            onChangeText={setPw}
          />
        </YStack>

        {/* 버튼들 */}
        <YStack ai="stretch" space="$3">
          <Button
            size="$4"
            backgroundColor="#A78BFA"
            color="white"
            animation={{ type: 'spring', damping: 14, mass: 0.6, stiffness: 180 }}
            pressStyle={{ scale: 0.96, y: 2, shadowColor: '$colorTransparent' }}
            onPress={login}
          >
            <Text color="white">로그인</Text>
          </Button>

          <Button
            size="$4"
            animation={{ type: 'spring', damping: 14, mass: 0.6, stiffness: 180 }}
            pressStyle={{ scale: 0.96, y: 2, shadowColor: '$colorTransparent' }}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text>회원가입</Text>
          </Button>
        </YStack>
      </Card>
    </YStack>
  )
}