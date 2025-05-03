// utils/color.ts
import { getTokenValue, Variable, variableToString } from 'tamagui'

/** `$blue10` 처럼 색상 토큰 → 실제 HEX / rgb 문자열 */
export function colors(token: string) {
  // getTokenValue 의 두 번째 인수는 ‘css property’ 용 힌트
  // 타입 안전성을 유지하려면 any 캐스팅 + 반환값 좁히기
  const v = getTokenValue(token as any, 'color') as string | Variable
  return typeof v === 'string' ? v : variableToString(v)
}
export const gradientBluePurple = ['#0080FF', '#715AFF']
export const gradientTealBlue = ['#2CC5A0', '#0080FF']
export const gradientPurplePink = ['#715AFF', '#FF71C7']