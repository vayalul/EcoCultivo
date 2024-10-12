import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Home from "./screens/Home";
import Miscultivos from "./screens/Miscultivos";
import Comunidad from "./screens/Comunidad";
import Mercado from "./screens/Mercado";
import Profile from "./screens/Profile";

const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator initialRouteName="Home"
        screenOptions={{
            tabBarActiveTintColor: 'green',
            headerShown: false,
        }}>
        <Tab.Screen name="HomeTab" component={Home} 
        options={{
            safeAreaView: true,
            tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" size={30} color= {color} />
            ),
        }}/>
        <Tab.Screen name="Miscultivos" component={Miscultivos}
        options={{
            tabBarLabel: 'Mis Cultivos',
            tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="leaf" size={30} color= {color} />
            ),
        }} />
        <Tab.Screen name="Comunidad" component={Comunidad}
        options={{
            tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="chat-processing" size={30} color= {color} />
            ),
        }} />
        <Tab.Screen name="Mercado" component={Mercado} 
        options={{
            tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="cart" size={30} color= {color} />
            ),
        }}/>
        <Tab.Screen name="Perfil" component={Profile}
        options={{
            tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="account-circle" size={30} color={color} />
            ),
        }}/>
        </Tab.Navigator>
    );
}

export default MyTabs;