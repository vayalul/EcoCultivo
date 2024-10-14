import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const NotFound = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>404 Error: Page Not Found</Text>
            <Text style={styles.text2}>The page you're trying to reach doesn't exist</Text>
            <TouchableOpacity
                style={styles.cajaBoton}
                onPress={() => navigation.navigate('Login')} // Direccionamos el boton a Login
                >
                <Text style={styles.botonTexto}>Volver a EcoCultivo</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f3f3',
    },
    text: {
        fontSize: 24,
        color: 'red',
    },
    text2: {
        fontSize: 15,
        color: 'red',
        marginTop: 10,
    },
    cajaBoton: {
        backgroundColor: 'green',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botonTexto: {
        fontSize: 15,
        color: 'white',
        borderRadius: 10,
        marginVertical: 10,
        height: 20,
        justifyContent: 'center',
    },
});

export default NotFound;
