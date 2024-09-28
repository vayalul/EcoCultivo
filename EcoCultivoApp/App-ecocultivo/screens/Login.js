import React, { useState } from 'react';
import { Text, StyleSheet, View, Image, ImageBackground, TextInput, TouchableOpacity, Alert } from 'react-native'; 

import appFirebase from '../credenciales'
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
const auth = getAuth(appFirebase)

export default function Login(props) {

    //creamos la variable de estado
    const [correo, setCorreo] = useState()
    const  [contraseña, setContraseña] = useState()

    const logueo = async()=>{
        try {
            await signInWithEmailAndPassword(auth,correo, contraseña)
            Alert.alert('Iniciando Sesion', 'Accediendo...')
            props.navigation.navigate('Home')
    }   catch(error) {
        console.log(error);
    }
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
                    <TextInput placeholder="Usuario" style={{paddingHorizontal: 15}} 
                    onChangeText={(text)=>setCorreo(text)}/>
                </View>

                <View style={styles.cajaTexto}>
                    <TextInput placeholder="Contraseña" style={{paddingHorizontal: 15}} secureTextEntry={true} 
                    onChangeText={(text)=>setContraseña(text)} />
                </View>

                <View style={styles.padreBoton}>
                    <TouchableOpacity style={styles.cajaBoton} onPress={logueo}>
                        <Text style={styles.TextoBoton}>Iniciar Sesión</Text>
                    </TouchableOpacity>
                </View>
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
});
