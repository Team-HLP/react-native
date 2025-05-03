// PhoneAuth.jsx
import React, { useState } from 'react';
import { Alert, Button, TextInput, View } from 'react-native';
import api from '../api/api';

export default function PhoneAuth({ phone, onVerified }) {
  const [code, setCode]       = useState('');
  const [requested, setReq]   = useState(false);
  const [loading,   setLoad]  = useState(false);

  const requestCode = async () => {
    if (!phone) return Alert.alert('전화번호를 먼저 입력하세요!');
    try {
      setLoad(true);
      await api.post('/guardian/sms/send', { phone_number: phone });
      Alert.alert('인증번호가 발송되었습니다.');
      setReq(true);
    } catch (e) {
      console.log(e);
      Alert.alert('전송 실패', '전화번호를 확인하세요.');
    } finally {
      setLoad(false);
    }
  };

  const verifyCode = async () => {
    if (code.length !== 6) return Alert.alert('6자리 인증번호를 입력하세요');
    try {
      setLoad(true);
      await api.post('/guardian/sms/verify', {
        phone_number: phone,
        certification_code: code,
      });
      Alert.alert('인증 성공');
      onVerified();
    } catch (e) {
      console.log(e);
      Alert.alert('인증 실패', '코드를 다시 확인하세요.');
    } finally {
      setLoad(false);
    }
  };

  return (
    <View>
      <Button title="인증번호 요청"
              onPress={requestCode}
              disabled={requested || loading} />
      {requested && (
        <>
          <TextInput
            placeholder="6자리 입력"
            keyboardType="number-pad"
            maxLength={6}
            onChangeText={setCode}
            value={code}
          />
          <Button title="인증번호 확인"
                  onPress={verifyCode}
                  disabled={loading} />
        </>
      )}
    </View>
  );
}