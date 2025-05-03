import React, { useEffect, useState } from 'react';
import { Button, FlatList, Text, TouchableOpacity, View } from 'react-native';
import api from '../api/api';

export default function ChildListScreen({ navigation }) {
  const [children, setChildren] = useState([]);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      const res = await api.get('/guardian/children');

      // 삭제되었거나 이상한 데이터(빈 문자열 등)가 있으면 걸러내기
      const filteredChildren = res.data.filter(child => {
        return child.name && child.name.trim() !== "" && child.age !== null;
      });


      const uniqueChildren = filteredChildren.filter(
        (child, index, self) =>
          index === self.findIndex((c) => c.id === child.id)
      );

      setChildren(uniqueChildren);
    } catch (e) {
      console.log(e);
    }
  };

  const goToDetail = (id) => {
    navigation.navigate('ChildDetail', { childrenId: id });
  };

  return (
    <View>
      <FlatList
        data={children}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => goToDetail(item.id)}>
            <Text style={{ padding: 10 }}>
              {item.name} / {item.sex} / {item.age}
            </Text>
          </TouchableOpacity>
        )}
      />
      <Button title="자녀 추가" onPress={() => navigation.navigate('AddChild')} />
    </View>
  );
}