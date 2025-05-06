import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { resetToLogin } from '../utils/NavigationService';

const api = axios.create({
  baseURL: 'https://api-hlp.o-r.kr',
});

// 요청할 때 토큰 자동 추가 (로그인 이후 보호자 인증 요청 등)
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('요청 보낼때 헤더:', config.headers);
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // 토큰 삭제
      await AsyncStorage.removeItem('accessToken');

      // 로그인 페이지로 이동 (NavigationService 이용)
      resetToLogin();
    }

    return Promise.reject(error);
  }
);

export default api;