import React, { useState } from 'react';
import { Alert, Button, TextInput, View } from 'react-native';
import api from '../api/api';
import PhoneAuth from '../components/PhoneAuth';

export default function SignupScreen({ navigation }) {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [verified, setVerified] = useState(false);

  const signup = async () => {
    if (!verified) {
      Alert.alert('전화번호 인증 필요');
      return;
    }

    try {
      await api.post('/guardian/register', {
        login_id: id,
        password: pw,
        name,
        phone_number: phone
      });

      Alert.alert('회원가입 성공', '이제 로그인하세요.', [
        { text: '확인', onPress: () => navigation.replace('Login') }
      ]);
    } catch (e) {
      console.log(e);
      Alert.alert('회원가입 실패', '입력 정보를 확인하세요.');
    }
  };

  return (
    <View>
      <TextInput placeholder="ID" onChangeText={setId} value={id} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPw} value={pw} />
      <TextInput placeholder="이름" onChangeText={setName} value={name} />
      <TextInput placeholder="전화번호" onChangeText={setPhone} value={phone} />
      <PhoneAuth phone={phone} onVerified={() => setVerified(true)} />
      <Button title="회원가입" onPress={signup} />
    </View>
  );
}