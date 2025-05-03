import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { registerRootComponent } from 'expo';
import React from 'react';

import AddChildScreen from './src/screens/AddChildScreen';
import ChildDetailScreen from './src/screens/ChildDetailScreen';
import ChildListScreen from './src/screens/ChildListScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ChildList" component={ChildListScreen} />
        <Stack.Screen name="AddChild" component={AddChildScreen} />
        <Stack.Screen name="ChildDetail" component={ChildDetailScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);

export default App;