import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { getFirestore, addDoc, getDocs, getDoc, collection, doc } from 'firebase/firestore';
import { db } from '../credenciales';

const FormularioCompra = ({ navigation }) => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [regionSeleccionada, setRegionSeleccionada] = useState('');
    const [comunaSeleccionada, setComunaSeleccionada] = useState('');
    const [regiones, setRegiones] = useState([]);
    const [comuna, setComuna] = useState([]);
    const [direccion, setDireccion] = useState('');
    const db = getFirestore();

const guardarDatosEnvio = async () => {
    if (!nombre || !apellido || !email || !telefono || !regionSeleccionada || !comunaSeleccionada || !direccion) {
        Alert.alert(
            'EcoCultivo',
            'Todos los campos deben ser completados'
        );
        return;
    }

const datosEnvio = {
    nombre,
    apellido,
    email,
    telefono,
    region: regionSeleccionada,
    comuna: comunaSeleccionada,
    direccion,
    fecha: new Date(),
};

try {
    await addDoc(collection(db, 'compras'), datosEnvio);
    Alert.alert(
        'EcoCultivo',
        'Los datos de la compra se han guardado correctamente'
    );
    navigation.navigate('WebPay');
} catch (error) {
    console.error('Error al guardar los datos de la compra', error);
    Alert.alert(
        'EcoCultivo',
        'Ha ocurrido un error al guardar los datos de la compra'
        );
    }
};

const obtenerRegiones = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'regiones'));
        const regiones = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRegiones(regiones);
    } catch (error) {
        console.error('Error al obtener las regiones:', error);
      Alert.alert('Error', 'No se pudieron cargar las regiones.');
    }
};

const obtenerComunaPorRegion = async (regionId) => {
    try {
        const docRef = doc(db, 'regiones', regionId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const comunaData = docSnap.data().comuna || [];
            console.log('Comunas obtenidas:', comunaData);
            setComuna(comunaData);
        } else {
            console.warn("La región no existe en la Base de Datos")
            setComuna([]);
        }
    } catch (error) {
        console.error("Error al obtener comunas:", error);
        setComuna([]);
    }
};

useEffect(() => {
    obtenerRegiones();
}, []);

// utilizamos este useffect para cargar las comunas cuando se seleccione una region
useEffect(() => {
    if (regionSeleccionada) {
        obtenerComunaPorRegion(regionSeleccionada);
    } else {
        setComuna([]);
    }
}, [regionSeleccionada]);

const validarEmail = (email) => {
    // Expresión regular para validar el correo electrónico
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    return regex.test(email);
};


return (
    <ScrollView style={styles.container}> 
        <Text style={styles.title}>Datos de Envio</Text>
        <View style={styles.logoContainer}>
                <Image source={require('../assets/Logo.png')} style={styles.logo} />
            </View>

        <View style={styles.cajaTexto}>
            <TextInput placeholder="Nombre" style={[styles.input, { paddingHorizontal: 15 }]}
                value={nombre} onChangeText={setNombre}/>
        </View>
        <View style={styles.cajaTexto}>
            <TextInput placeholder="Apellido" style={[styles.input, { paddingHorizontal: 15 }]}
                value={apellido} onChangeText={setApellido}/>
        </View>
        <View style={styles.cajaTexto}>
            <TextInput placeholder="Correo" style={[styles.input, { paddingHorizontal: 15 }]}
                value={email} onChangeText={setEmail}/>
        </View>
        <View style={styles.cajaTexto}>
            <TextInput placeholder="Teléfono" style={[styles.input, { paddingHorizontal: 15 }]}
                value={telefono} onChangeText={setTelefono}/>
        </View>

        <Text>Seleccione su Región</Text>
        <Picker
            selectedValue={regionSeleccionada}
            onValueChange={(itemValue) => setRegionSeleccionada(itemValue)}
            style={styles.picker}>
                <Picker.Item label="Seleccione una región" value=""/>
                {regiones.map((region) => (
                    <Picker.Item key={region.id} label={region.nombre} value={region.id}/>
                ))}
        </Picker>

        {comuna.length > 0 ? (
            <View>
                <Text>Seleccione su Comuna</Text>
                <Picker
                selectedValue={comunaSeleccionada}
                onValueChange={(itemValue) => setComunaSeleccionada(itemValue)}
                style={styles.picker}
                >
                    <Picker.Item label="Seleccione una comuna" value=""/>
                    {comuna.map((comuna, index)=> (
                        <Picker.Item key={index} label={comuna.nombre} value={comuna.nombre}/>
                    ))}
                </Picker>
            </View>
        ) : (
            <Text>No hay comunas disponibles</Text>
        )}

        <View style={styles.cajaTexto}>
            <TextInput placeholder="Direccion" style={[styles.input, { paddingHorizontal: 15 }]}
                value={direccion} onChangeText={setDireccion}/>
        </View>

        <TouchableOpacity style={styles.button} onPress={guardarDatosEnvio}>
            <Text style={styles.buttonText}>Proceder al Pago</Text>
        </TouchableOpacity>
    </ScrollView>
);

};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center',

    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 80,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
      },
      picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
      },
      button: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'light',
      },
      errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -8,
        marginBottom: 10,
    },
    
});

export default FormularioCompra;