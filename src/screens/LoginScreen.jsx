import React, { useState } from 'react';
import { Alert, Button, TextInput, View } from 'react-native';
import api from '../api/api';
import { saveToken } from '../utils/storage';

export default function LoginScreen({ navigation }) {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const login = async () => {
    try {
      const res = await api.post('/guardian/login', {
        login_id: id,
        password: pw,
      });

      await saveToken(res.data.access_token);
      Alert.alert('로그인 성공');
      navigation.replace('ChildList');
    } catch (e) {
      console.log(e);
      Alert.alert('로그인 실패', '아이디나 비밀번호를 확인하세요.');
    }
  };

  return (
    <View>
      <TextInput placeholder="ID" onChangeText={setId} value={id} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPw} value={pw} />
      <Button title="로그인" onPress={login} />
      <Button title="회원가입" onPress={() => navigation.navigate('Signup')} />
    </View>
  );
}