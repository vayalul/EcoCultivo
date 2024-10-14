import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, Image, ImageBackground, TextInput, TouchableOpacity, Alert, Modal, Button, Touchable, ScrollView } from 'react-native'; 
import appFirebase, { db, auth } from '../credenciales';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Checkbox from '@react-native-community/checkbox';

export default function Registro({ navigation }) {
    const [nombre, setNombre] =  useState('');
    const [username, setUsername] =  useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    
    // Estado para manejar los errores
    const [errorNombre, setErrorNombre] = useState('');
    const [errorUsername, setErrorUsername] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorConfirmPassword, setErrorConfirmPassword] = useState('');


    useEffect(() => {
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

    const showTermsModal = () => {
        setModalVisible(true);
    };

    const aceptar = () => {
        setIsChecked(true);
        setModalVisible(false);
    };

    const rechazar = () => {
        setIsChecked(false);
        setModalVisible(false);
    };

    const onTextoLinkPress = () => {
        showTermsModal();
    };

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

        // Verificar si hay errores
        if (!isChecked) {
            Alert.alert('Si deseas registrarte, debes aceptar los términos y condiciones.');
            return; // Salimos de la función si no se acepta
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "usuarios", user.uid), {
                nombre: nombre,
                username: username,
                email: email,
            });

            console.log("UID del usuario registrado:", user.uid);
            Alert.alert('Registro Exitoso', 'Bienvenido a EcoCultivo');
            navigation.navigate('HomeTab'); // Navegamos al login despues de registrarse
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
                <TouchableOpacity onPress={() => setIsChecked(!isChecked)}>
                        <Text style={styles.checkbox}>
                            {isChecked ? '☑️' : '☐'} Acepto los {''}
                            <Text onPress={onTextoLinkPress} style={styles.onTextoLink}>
                                términos y condiciones
                            </Text>
                        </Text>
                </TouchableOpacity>
                </View>
                <View style={styles.padreBoton}>
                <TouchableOpacity style={styles.cajaBoton} onPress={registroUsuario}>
                <Text style={styles.TextoBoton}>Registrarse</Text>
                </TouchableOpacity>
                </View>

                <View style={styles.footerView}>
                    <Text style={styles.footerText}>
                        ¿Ya tienes una cuenta? 
                        <Text onPress={onFooterLinkPress} style={styles.footerLink}> Inicia sesión</Text>
                    </Text>
                </View>
            </View>
        

            {/* Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Términos y Condiciones</Text>
                        <ScrollView style={styles.scrollView}>
                        <Text style={styles.modalText}>
                        Bienvenido a EcoCultivo. Al utilizar nuestra aplicación, aceptas cumplir con estos términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, te recomendamos que no uses nuestra aplicación.
                            {'\n\n'}
                            1. Aceptación de Términos 
                            {'\n'}
                            Al acceder y utilizar EcoCultivo, aceptas estos Términos y Condiciones en su totalidad. Si no estás de acuerdo, debes abstenerte de utilizar nuestra aplicación.
                            {'\n\n'}
                            2. Descripción del Servicio 
                            {'\n'}
                            EcoCultivo es una aplicación diseñada para ayudar a los agricultores a acceder a información climática, compartir imágenes de sus cultivos y participar en un foro comunitario. Nos esforzamos por proporcionar información precisa y útil, pero no garantizamos su exactitud.
                            {'\n\n'}
                            3. Contacto
                            {'\n'}
                            Si tienes preguntas o comentarios sobre estos Términos y Condiciones, contáctanos mediante el Centro de Ayuda.
                        </Text>
                        </ScrollView>

                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity onPress={rechazar} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Rechazar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={aceptar} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Aceptar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    checkbox: {
        marginVertical: 10,
        fontSize: 14,
        marginBottom: 15,
        color: 'grey',
    },
    onTextoLink: {
        color: 'grey',
        textDecorationLine: 'underline',
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '85%',
        maxHeight: '60%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
    },
    scrollView: {
        width: '100%',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'gray',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        color: 'gray',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1, // Esto hará que los botones ocupen el mismo ancho
        marginHorizontal: 20, // Espacio entre botones
        alignItems: 'center',
        backgroundColor: 'green',
        borderColor: 'green', // Color del borde
        borderWidth: 1, // Ancho del borde
        paddingVertical: 15,
        borderRadius:40,
        marginTop: 20,
        width: 150,
    },
    modalButtonText: {
        color: 'white', // Color del texto
        fontSize: 14,
    },
    errorText: {
        color: 'red',
        marginTop: 5,
        textAlign: 'left',
    },
});
