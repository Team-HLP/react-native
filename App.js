import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { registerRootComponent } from 'expo';
import React from 'react';

// tamagui import 추가
import { TamaguiProvider } from 'tamagui';
import { tamaguiConfig } from './tamagui.config';

import AddChildScreen from './src/screens/AddChildScreen';
import ChildDetailScreen from './src/screens/ChildDetailScreen';
import ChildListScreen from './src/screens/ChildListScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import StatsScreen from './src/screens/StatsScreen';

// 여기 추가 (NavigationService import)
import { navigationRef } from './src/utils/NavigationService';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="ChildList" component={ChildListScreen} />
          <Stack.Screen name="AddChild" component={AddChildScreen} />
          <Stack.Screen name="ChildDetail" component={ChildDetailScreen} />
          <Stack.Screen
            name="Stats"
            component={StatsScreen}
            options={{ title: 'ADHD 통계' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TamaguiProvider>
  );
}

registerRootComponent(App);

export default App;