import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

export default function QuienesSomos() {
    const abrirEnlace = () => {
        Linking.openURL('https://github.com/vayalul/EcoCultivo').catch(err =>
            console.error('Error al abrir el enlace:', err)
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quiénes Somos</Text>
            <Text style={styles.text}>
                Somos un equipo comprometido con la agricultura urbana. Visita nuestro repositorio en GitHub para
                obtener más información:
            </Text>
            <TouchableOpacity onPress={abrirEnlace} style={styles.button}>
                <Text style={styles.buttonText}>Visítanos en GitHub</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
