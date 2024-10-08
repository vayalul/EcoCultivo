import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, Image, ImageBackground, TextInput, TouchableOpacity, Alert } from 'react-native'; 

import appFirebase from '../credenciales'
import {getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'

const auth = getAuth(appFirebase)

export default function Login({ navigation }) {

    //creamos la variable de estado
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // implementamos el hook UseEffect para manejar la persistencia de la autenticacion de los usuarios
    // al iniciar sesion en nuestro sistema
    useEffect(() => {
        // Limpiamos los campos de texto al cargar la pantalla del Login
        setEmail('');
        setPassword('');

        const unsuscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Si el usuario esta logueado, redirigir a la pantalla Home
                navigation.navigate('HomeTab');
        }
    });
    // Limpiamos el listener al desmontar el componente
    return () => unsuscribe();
    }, []);

    const logueo = async() => {
        try {
            // Intentar iniciar sesión
            await signInWithEmailAndPassword(auth, email, password)
            
            // Solo muestra la alerta y navega si el login fue exitoso
            Alert.alert('Iniciando Sesión', 'Accediendo...')
            navigation.navigate('Home')
            
        } catch (error) {
            console.log(error);
            // Si ocurre un error, muestra solo la alerta de error
            Alert.alert('Error', 'El usuario o la contraseña son incorrectos')
        }
    }

    const onFooterLinkPress = () => {
        navigation.navigate('Registro')
    }

    return (
      <ImageBackground 
        source={require('../assets/Fondo.png')}
        style={styles.fondo}
        resizeMode="cover">
        <View style={styles.padre}>
            <View>
                <Image source={require('../assets/Logo.png')} style={styles.logo} />
            </View>

            <View style={styles.tarjeta}>
                <View style={styles.cajaTexto}>
                    <TextInput placeholder="Correo" style={{paddingHorizontal: 15}} 
                    onChangeText={(text)=>setEmail(text)}/>
                </View>

                <View style={styles.cajaTexto}>
                    <TextInput placeholder="Contraseña" style={{paddingHorizontal: 15}} secureTextEntry={true} 
                    onChangeText={(text)=>setPassword(text)} />
                </View>

                <View style={styles.padreBoton}>
                    <TouchableOpacity style={styles.cajaBoton} onPress={logueo}>
                        <Text style={styles.TextoBoton}>Iniciar Sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.footerView}>
                <Text style={styles.footerText}>¿No tienes una cuenta? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Regístrate</Text></Text>
            </View>
        </View>
      </ImageBackground>
    );
}

const styles = StyleSheet.create({
    fondo: {
        flex: 1, 
    },
    padre: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 90,
    },
    logo: {
        width: 150,
        height: 150,
        borderRadius: 80,
        borderColor: 'white',
        position: 'absolute',
        top: -150,
        left: -70,
    },
    tarjeta: {
        margin: 30,
        backgroundColor: 'white',
        borderRadius: 20,
        width: '70%',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    cajaTexto: {
        backgroundColor: '#f3f3f3',
        borderRadius: 10,
        marginVertical: 10,
        height: 25,
        justifyContent: 'center',
    },
    padreBoton: {
        alignItems: 'center',
    },
    cajaBoton: {
        backgroundColor: 'green',
        paddingVertical: 15,
        borderRadius: 30,
        marginTop: 20,
        width: 150,
    },
    TextoBoton: {
        textAlign: 'center',
        color: 'white',
    },
    footerView: {
        marginTop: 20,
        alignItems: 'center',
    },
    footerText: {
        color: 'white',
    },
    footerLink: {
        color: 'white',
        textDecorationLine: 'underline',
    },
});
