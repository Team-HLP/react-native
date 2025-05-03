import React, { useState } from 'react';
import { Alert, Button, TextInput, View } from 'react-native';
import api from '../api/api';

export default function PhoneAuth({ phone, onVerified }) {
  const [code, setCode] = useState('');
  const [requested, setRequested] = useState(false);

  const requestCode = async () => {
    try {
      await api.post('/guardian/sms/send', { phone_number: phone });
      Alert.alert('인증번호가 발송되었습니다.');
      setRequested(true);
    } catch (e) {
      console.log(e);
      Alert.alert('인증번호 요청 실패', '전화번호를 확인하세요.');
    }
  };

  const verifyCode = async () => {
    try {
      await api.post('/guardian/sms/verify', {
        phone_number: phone,
        certification_code: code,
      });
      Alert.alert('인증 성공');
      onVerified();
    } catch (e) {
      console.log(e);
      Alert.alert('인증 실패', '인증번호를 다시 확인하세요.');
    }
  };

  return (
    <View>
      <Button title="인증번호 요청" onPress={requestCode} disabled={requested} />
      <TextInput placeholder="인증번호 입력" onChangeText={setCode} value={code} keyboardType="numeric" />
      <Button title="인증번호 확인" onPress={verifyCode} />
    </View>
  );
}