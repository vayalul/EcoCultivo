import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, addDoc, getDocs, query, where, doc, deleteDoc} from 'firebase/firestore';
import { auth, db } from '../credenciales';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import getClima from '../clima';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const cultivosDisponibles = [
    {nombrecultivo: 'Tomate'},
    {nombrecultivo: 'Ajo'},
    {nombrecultivo: 'Zanahoria'},
    {nombrecultivo: 'Papa'},
]


const Miscultivos = () => {
 
    const [cultivos, setCultivos] = useState([]);
    const [selectedCultivo, setSelectedCultivo] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [fecha, setFecha] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [clima, setClima] = useState(null);
    const [ubicacion, setUbicacion] = useState('');
    const [loadingClima, setLoadingClima] = useState(true);
    const [infoModalVisible, setInfoModalVisible] = useState(false);
    const [loadingCultivos, setLoadingCultivos] = useState(false);
    const [userId, setUserId] = useState(null);
    const [infoCultivos, setInfoCultivos] = useState([]);

    const navigation = useNavigation();

    const getClimaStyle = (temperature) => {
        if (temperature < 10) {
            return { backgroundColor: '#b3d9ff', icon: 'weather-snowy' };
        } else if (temperature >= 10 && temperature <= 25) {
            return { backgroundColor: '#d9f2d9', icon: 'weather-partly-cloudy' };
        } else {
            return { backgroundColor: '#ffd9b3', icon: 'weather-sunny' };
        }
    };

    const imageCultivos = {
        Tomate: 'https://firebasestorage.googleapis.com/v0/b/ecocultivoapp.appspot.com/o/imagecultivos%2FTomate.png?alt=media&token=4df3a06f-f813-41ff-aa3a-7b42a9d35037',
        Papa: 'https://firebasestorage.googleapis.com/v0/b/ecocultivoapp.appspot.com/o/imagecultivos%2Fpapas.png?alt=media&token=69c5571e-9dfb-47ad-b3a5-9d1d575b117f',
        Zanahoria: 'https://firebasestorage.googleapis.com/v0/b/ecocultivoapp.appspot.com/o/imagecultivos%2Fzanahoria.png?alt=media&token=dec34eaa-a353-4b6b-a8df-b451081ce1d9',
        Ajo: 'https://firebasestorage.googleapis.com/v0/b/ecocultivoapp.appspot.com/o/imagecultivos%2Fajo.png?alt=media&token=55abb7f5-4936-4588-be1f-99f8e9d67502',
        defecto: 'https://firebasestorage.googleapis.com/v0/b/ecocultivoapp.appspot.com/o/imagecultivos%2Fdefecto.png?alt=media&token=8a3a5acc-2d84-45b2-9175-8f7220308423', 
    };


    const climaStyle = clima ? getClimaStyle(Math.round(clima.main.temp)) : { backgroundColor: '#d9f2d9', icon: 'weather-sunset' };

    const agregarCultivo = async () => {
        if(!selectedCultivo && !fecha) return Alert.alert('Advertencia', 'Debes seleccionar un cultivo y una fecha de plantación');

        const imagenCultivo = imageCultivos[selectedCultivo] || imageCultivos['defecto'];

        if(selectedCultivo && fecha)  {

            try {
                await addDoc(collection(db, 'cultivos'), {
                    nombrecultivo: selectedCultivo.nombrecultivo,
                    userId: userId,
                    fechacultivo: fecha.toLocaleDateString('es-CL'), // Formato de fecha en español de Chile
                    imagen: imagenCultivo,
                });
                console.log('Cultivo agregado exitosamente');
                Alert.alert('Éxito', 'Cultivo agregado correctamente');
                setSelectedCultivo(null);
                setFecha(new Date());
                setModalVisible(false);
                obtenerCultivos();
            } catch (error) {
                console.error('Error al agregar cultivo:', error);
                Alert.alert('Error', 'Hubo un error al agregar el cultivo');
            }
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
        } finally {
            setLoadingCultivos(false);
        }
    };

    const obtenerCultivoSelecionado = async (selectedCultivo) => {
        if (selectedCultivo) {
            try {
              const q = query(
                collection(db, 'infocultivos'),
                where('nombrecultivo', '==', selectedCultivo.nombrecultivo)
              );
        
              const querySnapshot = await getDocs(q);
        
              if (!querySnapshot.empty) {
                const docData = querySnapshot.docs[0].data();
                setInfoCultivos(docData); 
              } else {
                console.log('No se encontró información para este cultivo');
                setInfoCultivos(null); 
              }
            } catch (error) {
              console.error('Error obteniendo la información del cultivo:', error);
            }
        }
    };

    const eliminarCultivo = async (cultivoId) => {
        Alert.alert('Eliminar Cultivo', '¿Estás seguro de eliminar este cultivo?', [
            {   text: 'Cancelar', style: 'cancel' },
            {   text: 'Eliminar', style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteDoc(doc(db, 'cultivos', cultivoId));
                        console.log('Cultivo eliminado correctamente');
                        Alert.alert('Éxito', 'Cultivo eliminado correctamente');
                        setCultivos((prevCultivos) => prevCultivos.filter((cultivo) => cultivo.id !== cultivoId));
                        setInfoModalVisible(false);
                        obtenerCultivos();
                    } catch (error) {
                        console.error('Error al eliminar cultivo:', error);
                        Alert.alert('Error', 'Hubo un error al eliminar el cultivo');
                    }
                }
            }
        ]);
    };


    useEffect(() => {
        const userId = auth.currentUser;
        if (userId) {
            setUserId(userId.uid);
        }

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
                setLoadingClima(false);
            }
        };

        fetchClima();
        obtenerCultivos();
        obtenerCultivoSelecionado(selectedCultivo);
    }, [selectedCultivo]);
    

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
                <Text>No se pudo obtener el clima en este momento, por favor intente más tarde</Text>
            )}
            </View>
            {loadingCultivos ? (
                <View style={styles.noCultivosContainer}>
                    <Text style={styles.noCultivosText}>Cargando cultivos...</Text>
                </View>
            ) : cultivos.length === 0 ? (
                <View style={styles.noCultivosContainer}>
                    <Text style={styles.noCultivosText}>No tienes cultivos aún. Agrega uno nuevo.</Text>
                </View>
            ) : (
                <FlatList
                    data={cultivos}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => {
                            setSelectedCultivo(item);
                            setInfoModalVisible(true);}}>
                        <View style={styles.cultivoItem}>
                            <Image source={{ uri: imageCultivos[item.nombrecultivo] || imageCultivos['defecto'] }} style={styles.imagenCultivo} />
                            <Text style={styles.cultivoText}>Cultivo: {item.nombrecultivo}</Text>
                            <Text style={styles.cultivoText}>Fecha: {item.fechacultivo}</Text>

                            <TouchableOpacity
                            style={styles.botonSeguimiento}
                            onPress={() => navigation.navigate('Seguimiento', { cultivo: item })}
                        >
                            <Text style={styles.botonTextoSeguimiento}>Seguimiento</Text>
                        </TouchableOpacity>
                        </View>
                        </TouchableOpacity>
                    )}
                />
            )}

            {/* Modal para mostrar info del cultivo */}
            <Modal visible={infoModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainerInfo}>
                    <View style={styles.modalContentInfo}>
                        <Text style={styles.modalTitleInfo}>Información del Cultivo</Text>
                        <Image source={{ uri: imageCultivos[selectedCultivo?.nombrecultivo] || imageCultivos['defecto'] }} style={styles.imagenCultivo} />
                        <Text style={styles.cultivoTextInfo}>Cultivo: {selectedCultivo?.nombrecultivo}</Text>
                        <Text style={styles.cultivoTextInfo}>Fecha: {selectedCultivo?.fechacultivo}</Text>
                        {/* Información adicional de infocultivos */}
                        {infoCultivos ? (
                            <>
                              <Text style={styles.cultivoTextInfo}>Prevención: {infoCultivos?.prevencion}</Text>
                              <Text style={styles.cultivoTextInfo}>Abono: {infoCultivos?.abono}</Text>
                              <Text style={styles.cultivoTextInfo}>Tiempo Cosecha: {infoCultivos?.tiempocosecha}</Text>
                              <Text style={styles.cultivoTextInfo}>Riego: {infoCultivos?.riego}</Text>
                              <Text style={styles.cultivoTextInfo}>Espacio Mínimo Plantación: {infoCultivos?.espaciominimo}</Text>
                            </>
                        ) : (
                            <Text style={styles.cultivoTextInfo}>Cargando información del cultivo...</Text>
                        )}

                        {/* Botón para eliminar el cultivo */}
                        <View style={styles.buttonContainerInfo}>
                            <TouchableOpacity
                                style={styles.botonEliminarInfo}
                                onPress={() => eliminarCultivo(selectedCultivo.id)}
                            >
                                <Text style={styles.botonTextoInfo}>Eliminar Cultivo</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.botonCerrarInfo} onPress={() => setInfoModalVisible(false)}>
                                <Text style={styles.botonTextoInfo}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity style={styles.botonAgregar} onPress={() => setModalVisible(true)}>
                <Text style={styles.botonTexto}>Agregar Cultivo</Text>
            </TouchableOpacity>

            {/* Modal para agregar un nuevo cultivo */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Agregar Nuevo Cultivo</Text>
                        
                        {/* Picker de cultivos disponibles */}
                        <Text style={styles.label}>Selecciona el cultivo</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedCultivo?.nombrecultivo}
                                onValueChange={(itemValue, itemIndex) => {
                                    const cultivoSeleccionado = cultivosDisponibles.find(
                                        (cultivo) => cultivo.nombrecultivo === itemValue
                                    );
                                    setSelectedCultivo(cultivoSeleccionado);
                                }}
                                style={styles.picker}
                            >
                                <Picker.Item label="Selecciona un cultivo..." value="" />
                                {cultivosDisponibles.map((cultivo) => (
                                    <Picker.Item
                                        key={cultivo.nombrecultivo}
                                        label={cultivo.nombrecultivo}
                                        value={cultivo.nombrecultivo}
                                    />
                                ))}
                            </Picker>
                        </View>

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
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10, 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
        margin: 10,
    },
    selectedItem: {
        backgroundColor: 'lightgreen',
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
    botonTexto: { 
        color: 'white', 
        fontWeight: 'bold',
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
        width: '90%', 
        maxHeight: '80%', 
        alignItems: 'center',
    },
    modalTitle: { 
        fontSize: 20, 
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
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
        marginTop: 20,
        marginVertical: 20,
    },
    label: { 
        fontSize: 16, 
        marginVertical: 5, 
        marginTop: 15,
        fontWeight: 'bold',
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
        backgroundColor: 'brown', 
        padding: 15, 
        borderRadius: 10, 
        alignItems: 'center', 
        marginTop: 30,
        marginVertical: 10,
    },
    botonEliminar: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
        marginTop: 30,
    },
    imagenCultivo: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
        alignSelf: 'center',
    },
    modalContainerInfo: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContentInfo: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        width: '85%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    modalTitleInfo: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#4CAF50', 
    },
    cultivoTextInfo: {
        fontSize: 16,
        color: '#388E3C', 
        textAlign: 'center',
        marginVertical: 5,
        fontWeight: '600',
    },
    buttonContainerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%',
    },
    botonEliminarInfo: {
        backgroundColor: '#F44336', 
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        width: '45%',
        alignItems: 'center',
    },
    botonCerrarInfo: {
        backgroundColor: '#4CAF50', 
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        width: '45%',
        alignItems: 'center',
    },
    botonTextoInfo: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#C8E6C9',
        borderRadius: 8,
        marginVertical: 10,
        width: '100%',
        backgroundColor: '#F5F5F5',
    },
    picker: {
        height: 40,
        color: '#388E3C', 
    },
    botonSeguimiento: {
        marginTop: 10,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
    },
    botonTextoSeguimiento: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Miscultivos;
