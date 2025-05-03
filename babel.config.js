module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './tamagui.config.ts',  // 확장자 반드시 맞추기!!
        },
      ],
      'react-native-reanimated/plugin',  // 필요하면 (없어도 됨)
    ],
  };
};