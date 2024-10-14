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
    const [isChecked, setIsChecked] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        setNombre('');
        setUsername('');
        setEmail('');
        setPassword('');
    }, []);

    const onFooterLinkPress = () => {
        navigation.navigate('Login');
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

    const registroUsuario = async () => {
        if (!isChecked) {
            Alert.alert('Error', 'Debes aceptar los términos y condiciones');
            return;
        }

        if (!nombre || !username || !email || !password) {
            Alert.alert('Error', 'Por favor, complete todos los campos');
            return;
        }

        if (!validarEmail(email)) {
            Alert.alert('Error', 'El correo ingresado no es válido. Verifique su formato.');
            return;
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
            navigation.navigate('HomeTab');
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
                        <TextInput placeholder="Nombre Completo" style={{ paddingHorizontal: 15 }} 
                            onChangeText={(text) => setNombre(text)} />
                    </View>
                    <View style={styles.cajaTexto}>
                        <TextInput placeholder="Usuario" style={{ paddingHorizontal: 15 }} 
                            onChangeText={(text) => setUsername(text)} />
                    </View>
                    <View style={styles.cajaTexto}>
                        <TextInput placeholder="Correo" style={{ paddingHorizontal: 15 }} 
                            onChangeText={(text) => setEmail(text)} />
                    </View>
                    <View style={styles.cajaTexto}>
                        <TextInput placeholder="Contraseña" style={{ paddingHorizontal: 15 }} secureTextEntry={true} 
                            onChangeText={(text) => setPassword(text)} />
                    </View>

                    <TouchableOpacity onPress={() => setIsChecked(!isChecked)}>
                        <Text style={styles.checkbox}>
                            {isChecked ? '☑️' : '☐'} Acepto los {''}
                            <Text onPress={onTextoLinkPress} style={styles.onTextoLink}>
                                términos y condiciones
                            </Text>
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.padreBoton}>
                        <TouchableOpacity style={styles.cajaBoton} onPress={registroUsuario}>
                            <Text style={styles.TextoBoton}>Registrarse</Text>
                        </TouchableOpacity>
                    </View>
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
                        <ScrollView style={styles.ScrollView}>
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
});
