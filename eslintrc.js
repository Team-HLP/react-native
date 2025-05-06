module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-native/all', 
  ],
  plugins: [
    'react',
    'react-native',
  ],
  env: {
    browser: true,
    es2021: true,
    'react-native/react-native': true,
  },
  rules: {
    'react-native/no-raw-text': 'error',  // Text 없는 문자열 금지 룰
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};