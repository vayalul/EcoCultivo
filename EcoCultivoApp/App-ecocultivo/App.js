import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View} from 'react-native';
import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import MyTabs from './Navigation';
import Login from './screens/Login';
import Registro from './screens/Registro';
import PasswordReset from './screens/PasswordReset';
import NotFoundPage from './screens/NotFoundPage';
import QuienesSomos from './screens/QuienesSomos';
import ResumenCompra from './screens/ResumenCompra';
import FormularioCompra from './screens/FormularioCompra';

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
      <Stack.Screen name="Home" component={MyTabs} 
      options={{
        headerShown: false,
        title: 'Home',
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#128C7E'},
      }} />
      <Stack.Screen name="Registro" component={Registro} 
       options={{
        title: 'Registro',
        headerTintColor: 'white',
        headerShown: false,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#128C7E'},
          }} />
      <Stack.Screen name="PasswordReset" component={PasswordReset} 
       options={{
        title: 'Restablecer Contraseña',
        headerTintColor: 'white',
        headerShown: false,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#128C7E'},
          }} />
      <Stack.Screen name="NotFoundPage" component={NotFoundPage} 
       options={{
        title: 'Not Found 404',
        headerTintColor: 'white',
        headerShown: false,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#128C7E'},
          }} />
      <Stack.Screen name="QuienesSomos" component={QuienesSomos}
        options={{
          title: 'Quiénes Somos',
          headerTintColor: 'white',
          headerShown: false,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#128C7E'},
            }} />
      <Stack.Screen name="ResumenCompra" component={ResumenCompra} 
       options={{
        title: 'Resumen de la Compra',
        headerTintColor: 'white',
        headerShown: false,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#128C7E'},
          }} />
      <Stack.Screen name="FormularioCompra" component={FormularioCompra} 
       options={{
        title: 'Datos de la Compra',
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