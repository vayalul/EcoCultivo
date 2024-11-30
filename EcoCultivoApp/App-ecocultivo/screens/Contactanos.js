import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, StyleSheet } from "react-native";
import emailjs from 'emailjs-com'; // Importar emailjs

export default function Contactanos({ navigation }) {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [asunto, setAsunto] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleEnviarCorreo = async () => {
        if (!nombre || !email || !asunto || !mensaje) {
            Alert.alert('EcoCultivo', 'Por favor complete todos los campos');
            return;
        }

        try {
            // Enviar el correo utilizando EmailJS
            const templateParams = {
                from_name: nombre,
                from_email: email,
                subject: asunto,
                message: mensaje
            };

            // Reemplaza estos valores con tu información de EmailJS
            const serviceId = 'Servicio_EcoCultivo';
            const templateId = 'template_EcoCultivo';
            const userId = 'rFRIu60B8fbZskLig'; // Reemplaza con tu User ID
            

            await emailjs.send(serviceId, templateId, templateParams, userId);
            Alert.alert('EcoCultivo', 'Su mensaje ha sido enviado con éxito');
            navigation.navigate('Login'); // Redirige al home o a la pantalla que prefieras
        } catch (error) {
            console.log(error);
            Alert.alert('EcoCultivo', 'No se pudo enviar el correo');
        }
    };

    return (
        <ImageBackground 
            source={require('../assets/Fondo.png')} // Asegúrate de que la ruta sea correcta
            style={styles.fondo}
            resizeMode="cover">
            <View style={styles.padre}>
                <View>
                    
                </View>

                <View style={styles.tarjeta}>
                    <Text style={styles.titulo}>formulario de contacto</Text>
                    <View style={styles.cajaTexto}>
                        <TextInput
                            placeholder="Nombre"
                            style={styles.input}
                            value={nombre}
                            onChangeText={setNombre}
                        />
                    </View>
                    <View style={styles.cajaTexto}>
                        <TextInput
                            placeholder="Correo Electrónico"
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                    </View>
                    <View style={styles.cajaTexto}>
                        <TextInput
                            placeholder="Asunto"
                            style={styles.input}
                            value={asunto}
                            onChangeText={setAsunto}
                        />
                    </View>
                    <View style={styles.cajaTexto}>
                        <TextInput
                            placeholder="Mensaje"
                            style={[styles.input, styles.inputMensaje]}
                            value={mensaje}
                            onChangeText={setMensaje}
                            multiline
                        />
                    </View>

                    <TouchableOpacity style={styles.cajaBoton} onPress={handleEnviarCorreo}>
                        <Text style={styles.TextoBoton}>Enviar</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footerView}>
                    <Text style={styles.footerText}>
                        <Text onPress={() => navigation.navigate('Login')} style={styles.footerLink}>
                            Volver al inicio
                        </Text>
                    </Text>
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
    tarjeta: {
        margin: 30,
        backgroundColor: 'white',
        borderRadius: 20,
        width: '80%',
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
        marginBottom: 20,
        textAlign: 'center',
        color: 'black',
    },
    cajaTexto: {
        backgroundColor: '#f3f3f3',
        borderRadius: 10,
        marginVertical: 10,
        height: 40,
        justifyContent: 'center',
    },
    input: {
        paddingHorizontal: 15,
        height: '100%',
    },
    inputMensaje: {
        height: 20,  // Hacemos el campo mensaje más grande
        textAlignVertical: 'top',
    },
    cajaBoton: {
        backgroundColor: 'green',
        paddingVertical: 20,
        borderRadius: 30,
        marginTop: 20,
        alignItems: 'center',
        width: '60%',
    },
    TextoBoton: {
        textAlign: 'center',
        color: 'white',
    },
    footerView: {
        marginTop: 20,
    },
    footerText: {
        color: 'white',
        textDecorationLine: 'underline',
    },
    footerLink: {
        color: 'white',
    },
});
