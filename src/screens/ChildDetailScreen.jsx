import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import api from '../api/api';

export default function ChildDetailScreen({ route }) {
  const { childrenId } = route.params;
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadChildDetail = useCallback(async () => {
    try {
      const res = await api.get(`/guardian/children/${childrenId}`);
      setChild(res.data);
    } catch (e) {
      console.log(e);
      if (e.response?.status === 404) {
        setError('해당 자녀 정보를 찾을 수 없습니다.');
      } else {
        setError('자녀 정보를 불러오는 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  }, [childrenId]);

  useEffect(() => {
    loadChildDetail();
  }, [loadChildDetail]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>이름: {child.name}</Text>
      <Text>성별: {child.sex}</Text>
      <Text>나이: {child.age}</Text>
      <Text>전화번호: {child.phone_number}</Text>
    </View>
  );
}