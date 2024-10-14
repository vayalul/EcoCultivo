import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, Image, ImageBackground, TextInput, TouchableOpacity, Alert } from 'react-native'; 
import appFirebase, { db, auth } from '../credenciales';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Registro({ navigation }) {
    //  Estado para manejar el correo y contraseña
    const [nombre, setNombre] =  useState('');
    const [username, setUsername] =  useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Estado para manejar los errores
    const [errorNombre, setErrorNombre] = useState('');
    const [errorUsername, setErrorUsername] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorConfirmPassword, setErrorConfirmPassword] = useState('');


    useEffect(() => {
        // Limpiamos los campos de texto al cargar la pantalla de Registro
        setNombre('');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        
        // Limpiamos los errores al cargar la pantalla de Registro
        setErrorNombre('');
        setErrorUsername('');
        setErrorEmail('');
        setErrorPassword('');
        setErrorConfirmPassword('');
    }, []);

    const onFooterLinkPress = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    // Utilizaremos Regex para verificar el formato del email
    const validarEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Función para manejar el cambio en el campo de nombre
    const handleNombreChange = (text) => {
        setNombre(text);
        if(!text) {
            setErrorNombre('Este campo es obligatorio');
        } else{
            setErrorNombre('');
        }
    };

    // Función para manejar el cambio en el campo de username
    const handleUsernameChange = (text) => {
        setUsername(text);
        if(!text) {
            setErrorUsername('Este campo es obligatorio');
        } else {
            setErrorUsername('');
        }
    };

    // Función para manejar el cambio en el campo de email
    const handleEmailChange = (text) => {
        setEmail(text);
        if (validarEmail(text)) {
            setErrorEmail('');
        } else if (!text) {
            setErrorEmail('Este campo es obligatorio');
        } else {
            setErrorEmail('El correo ingresado no es válido');
        }
    };

    // Función para manejar el cambio en el campo de contraseña
    const handlePasswordChange = (text) => {
        setPassword(text);
        if(!text) {
            setErrorPassword('Este campo es obligatorio');
        } else if (password.length < 5) {
            setErrorPassword('Debe tener mas de 5 caracteres');
        } else {
            setErrorPassword('');
        }
    };

    // Función para manejar el cambio en el campo de confirmar contraseña
    const handleConfirmPasswordChange = (text) => {
        setConfirmPassword(text);
        if(!text) {
            setErrorConfirmPassword('El campo es obligatorio');
        } else if(password !== text) {
            setErrorConfirmPassword('Las contraseñas no coinciden'); 
        } else {
            setErrorConfirmPassword('');
        }
    };


    // Funcion para registrar el usuario
    const registroUsuario = async () => {
        //limpiar errores al intentar registrar
        setErrorNombre('');
        setErrorUsername('');
        setErrorEmail('');
        setErrorPassword('');
        setErrorConfirmPassword('');

        // Verificar si hay errores
        if (errorNombre || errorUsername || errorEmail || errorPassword || errorConfirmPassword) {
            Alert.alert('Por favor, corrige los errores antes de continuar.');
            return; // Salimos de la función si hay errores
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

        // Aquí agregamos el console.log() para verificar el UID del usuario ***
        console.log("UID del usuario registrado:", user.uid);

        // Guardamos el nombre y el username en Firestore
        await setDoc(doc(db, "usuarios", user.uid), {
            nombre: nombre,
            username: username,
            email: email,
        });

        // Alerta y navegacion dentro del sistema solo si el registro es exitoso
            Alert.alert('Registro Exitoso', 'Bienvenido a EcoCultivo');
            navigation.navigate('Home'); // Navegamos al login despues de registrarse
        } catch (error) {
            console.log("Error al registrar el usuario", error);
            Alert.alert('Error al registrase');
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
                    onChangeText={handleNombreChange}/>
                <Text style={errorNombre? styles.errorText :{ display: 'none'}}>
                    {errorNombre}
                </Text>
                </View>
                <View style={styles.cajaTexto}>
                <TextInput placeholder="Usuario" style={{paddingHorizontal: 15}} 
                    onChangeText={handleUsernameChange}/>
                <Text style={errorUsername? styles.errorText :{ display: 'none'}}>
                    {errorUsername}
                </Text>
                </View>
                <View style={styles.cajaTexto}>
                <TextInput placeholder="Correo" style={{paddingHorizontal: 15}} 
                    onChangeText={handleEmailChange}/>
                <Text style={errorEmail? styles.errorText :{ display: 'none'}}>
                    {errorEmail}
                </Text>
                </View>
                <View style={styles.cajaTexto}>
                <TextInput placeholder="Contraseña" style={{paddingHorizontal: 15}} secureTextEntry={true} 
                    onChangeText={handlePasswordChange} />
                <Text style={errorPassword? styles.errorText :{ display: 'none'}}>
                    {errorPassword}
                </Text>
                </View>
                <View style={styles.cajaTexto}>
                <TextInput placeholder="Confirmar Contraseña" style={{paddingHorizontal: 15}} secureTextEntry={true} 
                    onChangeText={handleConfirmPasswordChange} />
                <Text style={errorConfirmPassword? styles.errorText :{ display: 'none'}}>
                    {errorConfirmPassword}
                </Text>
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
        borderRadius: 30,
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
        marginVertical: 15,
        height: 30,
        justifyContent: 'flex-center',
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
    errorText: {
        color: 'red',
        marginTop: 5,
        textAlign: 'left', 
    }
});
