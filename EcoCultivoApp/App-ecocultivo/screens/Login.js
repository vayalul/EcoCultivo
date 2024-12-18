import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, Image, ImageBackground, TextInput, TouchableOpacity, Alert } from 'react-native'; 

import appFirebase from '../credenciales'
import {getAuth, signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth'
import AntDesign from '@expo/vector-icons/AntDesign';

const auth = getAuth(appFirebase)

export default function Login({ navigation }) {

   
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    
    useEffect(() => {
        
        setEmail('');
        setPassword('');

        const unsuscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                
                navigation.navigate('Home');
        }
    });
    
    return () => unsuscribe();
    }, []);

    const logueo = async() => {
        
        if (email === '' ||  password === '') {
            Alert.alert('Por favor, ingrese un correo y una contraseña válidos');
            return; 
        }

        try {
            await signInWithEmailAndPassword(auth, email, password)
            Alert.alert('Iniciando Sesión', 'Accediendo...')
            navigation.navigate('Home')
            
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'El usuario o la contraseña son incorrectos')
        }
    }

    const onFooterLinkPress = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Registro' }],
        })
    }

    const onFooterLinkPress2 = () => {
        navigation.navigate('Contactanos'); 
    };

    const onForgotPasswordPress = () => {
        navigation.navigate('PasswordReset');
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

                <View style={styles.footerView}>
                    <Text style={styles.footerResetText}>
                    ¿Olvidaste tu contraseña?{' '}
                    <Text onPress={onForgotPasswordPress} style={styles.footerLinkReset}>Recuperar</Text></Text>
                </View>

                <View style={styles.padreBoton}>
                    <TouchableOpacity style={styles.cajaBoton} onPress={logueo}>
                        <Text style={styles.TextoBoton}>Iniciar Sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.footerView1}>
                <Text style={styles.footerText}>¿No tienes una cuenta? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Regístrate</Text></Text>
            </View>
            <View style={styles.footerView2}>
                <Text style={styles.footerText}>¿Necesitas ayuda? <Text onPress={onFooterLinkPress2} style={styles.footerLink}>Centro de Ayuda</Text><AntDesign name="customerservice" size={24} color="white" /></Text>
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
    footerView1: {
        marginTop: 20,
        alignItems: 'center',
    },
    footerView2: {
        marginTop: 20,
        alignItems: 'center',
    },
    footerResetText: {
        color: 'grey',
        alignItems: 'center',
        fontSize:  13,
    },
    footerLinkReset: {
        color: 'grey',
        textDecorationLine: 'underline',
        fontSize:  13,

    },
    footerText: {
        color: 'white',
    },
    footerLink: {
        color: 'white',
        textDecorationLine: 'underline',
    },
    
});
