import React, { useEffect, useState } from "react";
import { View, Text, Image, ImageBackground, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../credenciales'; // Asegúrate de que la ruta sea correcta

export default function PasswordReset({ navigation }) {
    const [email, setEmail] = useState('');

    // useEffect(() => {
    //     setEmail('');
    // });

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert('Error', 'Por favor ingrese un correo electrónico');
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert('Correo enviado', 'Revise su correo para restablecer la contraseña');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const onFooterLinkPress = () => {
        navigation.navigate('Login')
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
                    <Text style={styles.titulo}>Restablezca su contraseña</Text>
                    <View style={styles.cajaTexto}> 
                        <TextInput placeholder="Ingrese su correo electrónico" style={{paddingHorizontal: 15}}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none" 
                        />
                    </View>
                    <View style={styles.padreBoton}>
                        <TouchableOpacity style={styles.cajaBoton} onPress={handleResetPassword}>
                            <Text style={styles.TextoBoton}>Enviar enlace</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.footerView}>
            <Text style={styles.footerText}><Text onPress={onFooterLinkPress} style={styles.footerLink}>Volver</Text></Text>
            </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    fondo: {
        flex: 1,
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
    padre: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 90,
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
    titulo: {
        fontSize: 22,
        marginBottom: 10,
        textAlign: 'center',
        color: 'black',
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
    footerText: {
        color: 'white',
        textDecorationLine:  'underline',

    },
});
