import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../credenciales';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import getClima from '../clima';


const Miscultivos = () => {
    const imageCultivos = {
        "tomate": "https://firebasestorage.googleapis.com/v0/b/ecocultivoapp.appspot.com/o/imagecultivos%2FTomate.png?alt=media&token=4df3a06f-f813-41ff-aa3a-7b42a9d35037",
        "zanahoria": "https://firebasestorage.googleapis.com/v0/b/ecocultivoapp.appspot.com/o/imagecultivos%2Fzanahoria.png?alt=media&token=dec34eaa-a353-4b6b-a8df-b451081ce1d9",
        "ajo": "https://firebasestorage.googleapis.com/v0/b/ecocultivoapp.appspot.com/o/imagecultivos%2Fajo.png?alt=media&token=55abb7f5-4936-4588-be1f-99f8e9d67502",
        "menta": "https://firebasestorage.googleapis.com/v0/b/ecocultivoapp.appspot.com/o/imagecultivos%2Fmenta.png?alt=media&token=cde5dfc4-04c5-46a2-ae51-78e9a3069251",
        "papas": "https://firebasestorage.googleapis.com/v0/b/ecocultivoapp.appspot.com/o/imagecultivos%2Fpapas.png?alt=media&token=69c5571e-9dfb-47ad-b3a5-9d1d575b117f",
        "defecto": "https://firebasestorage.googleapis.com/v0/b/ecocultivoapp.appspot.com/o/imagecultivos%2Fdefecto.png?alt=media&token=8a3a5acc-2d84-45b2-9175-8f7220308423"
    };

    const [cultivos, setCultivos] = useState([]);
    const [nuevoCultivo, setNuevoCultivo] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [fecha, setFecha] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false); // Estado para mostrar/ocultar el DateTimePicker
    const [clima, setClima] = useState(null);
    const [ubicacion, setUbicacion] = useState('');
    const [loadingClima, setLoadingClima] = useState(true);

    const getClimaStyle = (temperature) => {
        if (temperature < 10) {
            return { backgroundColor: '#b3d9ff', icon: 'weather-snowy' };
        } else if (temperature >= 10 && temperature <= 25) {
            return { backgroundColor: '#d9f2d9', icon: 'weather-partly-cloudy' };
        } else {
            return { backgroundColor: '#ffd9b3', icon: 'weather-sunny' };
        }
    };

    // En el renderizado
    const climaStyle = clima ? getClimaStyle(Math.round(clima.main.temp)) : { backgroundColor: '#d9f2d9', icon: 'weather-sunset' };

    const agregarCultivo = async () => {
        const userId = auth.currentUser.uid;

        if (!nuevoCultivo.trim()) {
            Alert.alert('Error', 'Por favor ingresa un nombre para el cultivo');
            return;
        }

        const imagenCultivo = imageCultivos[nuevoCultivo.toLowerCase()] || imageCultivos['defecto'];

        try {
            // Agregar el cultivo a Firestore
            await addDoc(collection(db, 'cultivos'), {
                nombrecultivo: nuevoCultivo,
                userId: userId,
                fechacultivo: fecha.toLocaleDateString('es-CL'), // Formato de fecha en español de Chile
                imagen: imagenCultivo,
            });
            console.log('Cultivo agregado exitosamente');
            Alert.alert('Éxito', 'Cultivo agregado correctamente');
            setNuevoCultivo('');
            setFecha(new Date());
            setModalVisible(false);
            obtenerCultivos();
        } catch (error) {
            console.error('Error al agregar cultivo:', error);
            Alert.alert('Error', 'Hubo un error al agregar el cultivo');
        }
    };

    const obtenerCultivos = async () => {
       try {
        const userId = auth.currentUser.uid;
        const q = query(collection(db, 'cultivos'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const cultivosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCultivos(cultivosData);
    } catch (error) {
        console.error("Error al obtener cultivos:", error);
    }
    };

    useEffect(() => {
        const fetchClima = async () => {
            try {
                const climaData = await getClima();
                if (climaData) {
                    setClima(climaData);
                    setUbicacion(climaData.name);
                }
            } catch (error) {
                console.error('Error al obtener el clima:', error);
            } finally {
                setLoadingClima(false); // Finaliza la carga
            }
        };
        fetchClima();
        obtenerCultivos();
    }, []);
    

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
            <Text style={styles.title}>Mis Cultivos</Text>
            {loadingClima ? (
                <Text>Cargando clima...</Text>
            ) : clima ? (
                <View style={[styles.climaContainer, { backgroundColor: climaStyle.backgroundColor }]}>
                    <Text style={styles.climaText}>{ubicacion}: {Math.round(clima.main.temp)}°C</Text>
                    <MaterialCommunityIcons
                        name={climaStyle.icon}
                        size={24}
                        color="black"
                    />
                </View>
            ) : (
                <Text>Error al cargar el clima</Text>
            )}
        </View>

            {cultivos.length === 0 ? (
                <View style={styles.noCultivosContainer}>
                    <Text style={styles.noCultivosText}>No tienes cultivos aún. Agrega uno nuevo.</Text>
                </View>
            ) : (
                <FlatList
                    data={cultivos}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <View style={styles.cultivoItem}>
                            <Image source={{ uri: imageCultivos[item.nombrecultivo.toLowerCase()] || imageCultivos['defecto'] }} style={styles.imagenCultivo} />
                            <Text style={styles.cultivoText}>Cultivo: {item.nombrecultivo}</Text>
                            <Text style={styles.cultivoText}>Fecha: {item.fechacultivo}</Text>
                        </View>
                    )}
                />
            )}

            <TouchableOpacity style={styles.botonAgregar} onPress={() => setModalVisible(true)}>
                <Text style={styles.botonTexto}>Agregar Cultivo</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Agregar Nuevo Cultivo</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre del cultivo"
                            value={nuevoCultivo}
                            onChangeText={setNuevoCultivo}
                        />

                        <Text style={styles.label}>Fecha de plantación</Text>
                        {/* Botón para mostrar el DateTimePicker */}
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                            <Text style={styles.dateText}>{fecha.toLocaleDateString('es-CL')}</Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={fecha}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(false); // Ocultar DateTimePicker después de seleccionar la fecha
                                    if (selectedDate) {
                                        setFecha(selectedDate);
                                    }
                                }}
                            />
                        )}
                        <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.botonCrear} onPress={agregarCultivo}>
                            <Text style={styles.botonTexto}>Crear Cultivo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.botonCerrar} onPress={() => setModalVisible(false)}>
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
        paddingHorizontal: 20, 
        paddingTop: 20,
    },
    header: { 
        marginBottom: 20,
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold',
    },
    climaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
    },
    climaText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginRight: 5,
    },
    noCultivosContainer: { 
        alignItems: 'center', 
        justifyContent: 'center', 
        flex: 1 
    },
    noCultivosText: { 
        fontSize: 18, 
        color: '#888' 
    },
    cultivoItem: { 
        flex: 1,
        padding: 15,
        backgroundColor: '#fff', // Fondo blanco para cada item
        borderRadius: 10,
        marginBottom: 10, // Espacio entre items
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
        margin: 10,
    },
    cultivoText: { 
        fontSize: 16,
    },
    botonAgregar: { 
        backgroundColor: 'green', 
        padding: 15, 
        borderRadius: 10, 
        alignItems: 'center',
        marginVertical: 10
    },
    botonTexto: { color: 'white', 
        fontWeight: 'bold' 
    },
    modalContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.5)' 
    },
    modalContent: { 
        backgroundColor: '#d9f2d9', 
        padding: 20, 
        borderRadius: 10, 
        width: '80%', 
        alignItems: 'center' 
    },
    modalTitle: { 
        fontSize: 20, 
        fontWeight: 'bold',
        marginBottom: 10, 
        color: 'green' 
    },
    input: { 
        borderWidth: 1, 
        borderColor: '#ccc', 
        borderRadius: 5, 
        padding: 10, 
        width: '100%', 
        marginVertical: 10 
    },
    botonCrear: { 
        backgroundColor: 'green', 
        padding: 15, 
        borderRadius: 10, 
        alignItems: 'center', 
        marginTop: 10 
    },
    label: { 
        fontSize: 16, 
        marginVertical: 5 
    },
    dateButton: { 
        padding: 10, 
        borderRadius: 5, 
        borderWidth: 1, 
        borderColor: '#ccc', 
        width: '100%', 
        alignItems: 'center', 
        marginVertical: 10 
    },
    dateText: { 
        fontSize: 16, 
        color: '#333' 
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    botonCerrar: { 
        backgroundColor: 'firebrick', 
        padding: 15, 
        borderRadius: 10, 
        alignItems: 'center', 
        marginTop: 10 
    },
    imagenCultivo: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
        alignSelf: 'center',
    },
});

export default Miscultivos;
