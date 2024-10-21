import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Modal, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Miscultivos = () => {
    const [cultivos, setCultivos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [nombreCultivo, setNombreCultivo] = useState('');
    const [fechaCultivo, setFechaCultivo] = useState('');

    // Función para agregar un nuevo cultivo
    const agregarCultivo = () => {
        if (nombreCultivo && fechaCultivo) {
            const nuevoCultivo = `${nombreCultivo} - Fecha: ${fechaCultivo}`;
            setCultivos([...cultivos, nuevoCultivo]);
            setModalVisible(false);
            setNombreCultivo('');  // Limpiar el campo de texto
            setFechaCultivo('');   // Limpiar el campo de texto
        } else {
            alert('Por favor, completa todos los campos.');
        }
    };

    // Función para validar el formato de la fecha
    const isValidDate = (dateString) => {
        const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;
        return regex.test(dateString);
    };

    const renderCultivo = ({ item }) => (
        <View style={styles.cultivoItem}>
            <Text>{item}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mis Cultivos</Text>
            </View>

            {cultivos.length === 0 ? (
                <View style={styles.noCultivos}>
                    <Text>No tienes cultivos aún.</Text>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.botonAgregar}>
                        <Text style={styles.botonTexto}>Agregar Cultivo</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.listaCultivos}>
                    <FlatList
                        data={cultivos}
                        renderItem={renderCultivo}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.botonAgregar}>
                        <Text style={styles.botonTexto}>Agregar Cultivo</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Modal para agregar cultivo */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}  // Cierra el modal al presionar atrás
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Logo de la aplicación */}
                        <Image source={require('../assets/Logo.png')} style={styles.logo} />
                        <Text style={styles.modalTitle}>Agregar Cultivo</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre del cultivo"
                            value={nombreCultivo}
                            onChangeText={setNombreCultivo}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Fecha (DD/MM/AAAA)"
                            value={fechaCultivo}
                            onChangeText={setFechaCultivo}
                            keyboardType='numeric'
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={agregarCultivo} style={styles.botonAgregar}>
                                <Text style={styles.botonTexto}>Agregar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.botonCancelar}>
                                <Text style={styles.botonTexto}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    noCultivos: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    listaCultivos: {
        flex: 1,
    },
    cultivoItem: {
        padding: 10,
        marginVertical: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    botonAgregar: {
        backgroundColor: 'green',
        padding: 15,
        marginTop: 20,
        alignItems: 'center',
        borderRadius: 5,
    },
    botonCancelar: {
        backgroundColor: 'red',
        padding: 15,
        marginTop: 20,
        alignItems: 'center',
        borderRadius: 5,
        marginLeft: 10,
    },
    botonTexto: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 15,
    },
    logo: {
        width: 100,  // Ajusta el tamaño según tu logo
        height: 100, // Ajusta el tamaño según tu logo
        marginBottom: 15,
        borderRadius: 50,
        resizeMode: 'cover',
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

export default Miscultivos;
