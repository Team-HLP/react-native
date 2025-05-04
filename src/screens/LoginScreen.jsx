import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from '@tamagui/linear-gradient'
import { MotiView } from 'moti'
import React, { useState } from 'react'
import { Alert } from 'react-native'
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
      {/* 비눗방울 */}
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
        <MaskedView
          style={{ height: 90, alignSelf: 'stretch' }}
          maskElement={
            <YStack f={1} jc="center" ai="center">
              <Text fontSize="$10" fontWeight="900" letterSpacing={1}>
                ADHD‑VR
              </Text>
            </YStack>
          }
        >
          <LinearGradient f={1} colors={gradientBluePurple} start={[0, 0]} end={[1, 1]} />
        </MaskedView>

        <Text ta="center" fos="$6" theme="alt2" mt="$-5">
          for Parents
        </Text>

        <YStack ai="stretch" space="$4">
          <Input size="$4" placeholder="ID" value={id} onChangeText={setId} />
          <Input size="$4" placeholder="Password" secureTextEntry value={pw} onChangeText={setPw} />
        </YStack>

        <YStack ai="stretch" space="$3">
          <Button
            size="$4"
            backgroundColor="#A78BFA" 
            color="white"
            animation={{ type: 'spring', damping: 14, mass: 0.6, stiffness: 180 }}
            pressStyle={{ scale: 0.96, y: 2, shadowColor: '$colorTransparent' }}
            onPress={login}
          >
            로그인
          </Button>

          <Button
            size="$4"
            animation={{ type: 'spring', damping: 14, mass: 0.6, stiffness: 180 }}
            pressStyle={{ scale: 0.96, y: 2, shadowColor: '$colorTransparent' }}
            onPress={() => navigation.navigate('Signup')}
          >
            회원가입
          </Button>
        </YStack>
      </Card>
    </YStack>
  )
}