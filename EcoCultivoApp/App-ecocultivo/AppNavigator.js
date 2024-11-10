// AppNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MyTabs from './Navigation'; // Importa tu Bottom Tab Navigator
import CarritoScreen from './screens/CarritoScreen'; // Pantalla de carrito de compras

const Drawer = createDrawerNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen 
          name="Home" 
          component={MyTabs} 
          options={{ drawerLabel: 'Inicio' }}
        />
        <Drawer.Screen 
          name="Carrito" 
          component={CarritoScreen} 
          options={{ drawerLabel: 'Carrito de Compras' }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;

//ESTO SE HIZO PARA CREAR EL DRAWER O SIDE MENU
