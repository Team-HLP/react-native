// tamagui.config.ts
import { config } from '@tamagui/config/v3'
import { createTamagui, createTheme } from 'tamagui'

/* light  / dark  두 가지 만들기 --------------------- */
const brandAltLight = createTheme({
  background: '#FDF5C9',
  color: '#5B4B20',
  borderColor: '#E2D59C',
  hoverBackground: '#F9E8A0',
  pressBackground: '#F4DE85',
})

const brandAltDark = createTheme({
  background: '#58522F',
  color: '#FDF5C9',
  borderColor: '#857A3C',
  hoverBackground: '#66603A',
  pressBackground: '#726A40',
})

export const tamaguiConfig = createTamagui({
  ...config,

  themes: {
    ...config.themes,

    /* 접미사를 붙여 light/dark 모두 등록 */
    brand_alt_light: brandAltLight,
    brand_alt_dark:  brandAltDark,

    /* 보통 이름도 하나 더 둬서 편의상 써 줌 */
    brand_alt: brandAltLight,
  },
})

export type Conf = typeof tamaguiConfig
export default tamaguiConfig