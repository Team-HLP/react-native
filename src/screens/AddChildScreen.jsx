import React, { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import api from '../api/api';
import { getToken } from '../utils/storage';

export default function AddChildScreen({ navigation }) {
  const [childrenId, setChildrenId] = useState('');
  const [loading, setLoading] = useState(false);

  const addChild = async () => {
    if (!childrenId) {
      Alert.alert('자녀 ID를 입력하세요');
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();

      await api.post(
        '/guardian/children',
        { children_id: parseInt(childrenId, 10) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('자녀 추가 성공', '자녀가 정상적으로 추가되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      console.log(e);

      // 에러 코드에 따라 분기
      if (e.response?.status === 400) {
        Alert.alert('자녀 추가 실패', '이미 추가된 자녀이거나 잘못된 ID입니다.');
      } else if (e.response?.status === 404) {
        Alert.alert('자녀 추가 실패', '존재하지 않는 자녀 ID입니다.');
      } else {
        Alert.alert('자녀 추가 실패', '네트워크 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="추가할 자녀 ID 입력"
        keyboardType="numeric"
        onChangeText={setChildrenId}
        value={childrenId}
        style={styles.input}
        editable={!loading}
      />
      <Button title={loading ? "처리 중..." : "자녀 추가"} onPress={addChild} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    fontSize: 16,
    padding: 10,
  },
});