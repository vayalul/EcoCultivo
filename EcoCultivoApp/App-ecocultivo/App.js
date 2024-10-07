import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View} from 'react-native';
import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import MyTabs from './Navigation';
import Login from './screens/Login';
import Registro from './screens/Registro';

export default function App() {

  const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} 
      options={{ 
        title: 'Login',
        headerTintColor: 'white',
        headerShown: false,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#128C7E'},
      }} />
      <Stack.Screen name="HomeTab" component={MyTabs} 
      options={{
        title: 'Home',
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#128C7E'},
      }} />
      <Stack.Screen name="Registro" component={Registro} 
       options={{
        title: "'Home'",
        headerTintColor: 'white',
        headerShown: false,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#128C7E'},
          }} />
    </Stack.Navigator>
  );
}

  return (
    <NavigationContainer>
      <MyStack/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
