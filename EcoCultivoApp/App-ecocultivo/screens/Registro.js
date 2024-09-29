import React, { useState } from 'react';
import { Text, StyleSheet, View, Image, ImageBackground, TextInput, TouchableOpacity, Alert } from 'react-native'; 
import appFirebase from '../credenciales';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

//inicializamos Firestore
const db = getFirestore(appFirebase);
const auth = getAuth(appFirebase);

export default function Registro({ navigation }) {
    //  Estado para manejar el correo y contraseña
    const [nombre, setNombre] =  useState('');
    const [username, setUsername] =  useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onFooterLinkPress = () => {
        navigation.navigate('Login');
    };

    // Utilizaremos Regex para verificar el formato del email
    const validarEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    

    // Funcion para registrar el usuario
    const registroUsuario = async () => {
        if (!nombre || !username || !email || !password) {
            Alert.alert('Error', 'Por favor, complete todos los campos');
            return; // Salir si hay campos vacios
        }
        
        if (!validarEmail(email)) {
            Alert.alert('Error', 'El correo ingresado no es válido. Verifique su formato.')
            return; // Salir si el email es invalido
        }

        try {
            // Creamos el usuario en Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Obtenemos el UID del nuevo usuario
            const user = userCredential.user;

            // Guardamos el nombre y el username en Firestore
            await setDoc(doc(db, "usuarios", user.uid), {
                nombre:  nombre,
                username: username,
                email: email,
            });

            Alert.alert('Registro Exitoso', 'Bienvenido a EcoCultivo');
            navigation.navigate('Login'); // Navegamos al login despues de registrarse
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.message);
        }
    };

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
                <TextInput placeholder="Nombre" style={{paddingHorizontal: 15}} 
                    onChangeText={(text)=>setNombre(text)}/>
                </View>
                <View style={styles.cajaTexto}>
                <TextInput placeholder="Usuario" style={{paddingHorizontal: 15}} 
                    onChangeText={(text)=>setUsername(text)}/>
                </View>
                <View style={styles.cajaTexto}>
                <TextInput placeholder="Correo" style={{paddingHorizontal: 15}} 
                    onChangeText={(text)=>setEmail(text)}/>
                </View>
                <View style={styles.cajaTexto}>
                <TextInput placeholder="Contraseña" style={{paddingHorizontal: 15}} secureTextEntry={true} 
                    onChangeText={(text)=>setPassword(text)} />
                </View>
                <View style={styles.padreBoton}>
                <TouchableOpacity style={styles.cajaBoton} onPress={registroUsuario}>
                <Text style={styles.TextoBoton}>Registrarse</Text>
                </TouchableOpacity>
                </View>

            </View>

            <View style={styles.footerView}>
            <Text style={styles.footerText}>¿Ya tienes una cuenta? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Inicia sesión</Text></Text>
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
    }
});
