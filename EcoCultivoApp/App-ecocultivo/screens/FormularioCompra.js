import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { getFirestore, addDoc, getDocs, getDoc, collection, doc, QuerySnapshot } from 'firebase/firestore';
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

    // Estado para manejar los errores
    const [errorNombre, setErrorNombre] = useState('');
    const [errorApellido, setErrorApellido] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorTelefono, setErrorTelefono] = useState('');
    const [errorDireccion, setErrorDireccion] = useState('');

    useEffect(() => {
        setNombre('');
        setApellido('');
        setEmail('');
        setTelefono('');
        setDireccion('');
    }, []);

const guardarDatosEnvio = async () => {
    if (errorNombre || errorApellido || errorEmail || errorTelefono || errorDireccion) {
        Alert.alert(
            'EcoCultivo',
            'Por favor, corrige los errores antes de continuar.');
        return; // Salimos de la función si hay errores
    }   
    if (!nombre || !apellido || !email || !telefono || !regionSeleccionada || !comunaSeleccionada) {
        Alert.alert(
            'EcoCultivo',
            'Todos los campos deben ser completados'
        );
        return;
    }
    if (!validarEmail(email)) {
        Alert.alert(
            'EcoCultivo',
            'Por favor ingresa un correo electrónico válido.'
        );
        return;
    }
    if (!validarTelefono(telefono)) {
        Alert.alert(
            'EcoCultivo',
            'Por favor ingrese un número de teléfono válido +569'
        );
        return;
    }
    
    //generamos un codigo de compra unico para cada compra realizada
    const generarCodigoCompra = () => {
        const fecha = new Date();
        const annio = fecha.getFullYear();
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const dia = fecha.getDate().toString().padStart(2, '0');
        const hora = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');
        const segundos = fecha.getSeconds().toString().padStart(2, '0');
        const aleatorio = Math.floor(Math.random() * 1000);

        return `${annio}${mes}${dia}-${hora}${minutos}${segundos}-${aleatorio}`;
    };
    const codigoCompra = generarCodigoCompra();

const datosEnvio = {
    nombre,
    apellido,
    email,
    telefono,
    region: regionSeleccionada,
    comuna: comunaSeleccionada,
    direccion,
    fecha: new Date(),
    codigoCompra,
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

// Función para manejar el cambio en los campos
const handleNombreChange = (text) => {
    setNombre(text);
    setErrorNombre(text ? '' : 'Este campo es obligatorio');
};

const handleApellidoChange = (text) => {
    setApellido(text);
    setErrorApellido(text ? '' : 'Este campo es obligatorio');
};

const handleEmailChange = (text) => {
    setEmail(text);
    if (!text) {
        setErrorEmail('Este campo es obligatorio');
    } else if (!validarEmail(text)) {
        setErrorEmail('El correo ingresado no es válido');
    } else {
        setErrorEmail('');
    }
};

const handleTelefonoChange = (text) => {
    setTelefono(text);
    if (!text) {
        setErrorTelefono('Este campo es obligatorio');
    } else if (!validarTelefono(text)) {
        setErrorTelefono('El teléfono ingresado no es válido');
    } else {
        setErrorTelefono('');
    }
};

const handleDireccionChange = (text) => {
    setDireccion(text);
    setErrorDireccion(text ? '' : 'Este campo es obligatorio');
};

const obtenerRegiones = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'regiones'));
        const regiones = querySnapshot.docs.map((doc) => ({ id: doc.id, nombre: doc.data().nombre,
        }));
        console.log('Regiones obtenidas:', regiones);
        setRegiones(regiones);
    } catch (error) {
        console.error('Error al obtener las regiones:', error);
      Alert.alert('Error', 'No se pudieron cargar las regiones.');
    }
};

useEffect(() => {
    obtenerRegiones();
}, []);

const obtenerComunaPorRegion = async (regionId) => {
    try {
        console.log('Obteniendo comunas para la region:', regionId);
        const docRef = doc(db, 'regiones', regionId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const comunaData = docSnap.data().comuna || [];
            console.log('Comunas obtenidas:', comunaData);
            setComuna(comunaData);
        } else {
            console.warn("La region no existe en la Base de Datos");
            setComuna([]);
        }
    } catch (error) {
        console.error("Error al obtener comunas:", error);
        setComuna([]);
    }
};


// utilizamos este useffect para cargar las comunas cuando se seleccione una region
useEffect(() => {
    if (regionSeleccionada) {
        obtenerComunaPorRegion(regionSeleccionada);
    } else {
        setComuna([]);
    }
}, [regionSeleccionada]);


const validarEmail = (email) => {
    // Expresión regular para validar el mail
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    return regex.test(email);
};

const validarTelefono = (telefono) => {
    const regex = /^\+569\d{8}$/; // Valida +569 seguido de 8 dígitos
    return regex.test(telefono);
};

const regresar = () => {
    navigation.navigate ('Mercado');
}


return (
    <ScrollView style={styles.container}> 
        <Text style={styles.title}>Datos de Envio</Text>
        <View style={styles.logoContainer}>
                <Image source={require('../assets/Logo.png')} style={styles.logo} />
            </View>

        <View style={styles.cajaTexto}>
            <TextInput placeholder="Nombre" style={[styles.input, { paddingHorizontal: 15 }]}
                value={nombre} onChangeText={handleNombreChange}/>
            {errorNombre ? <Text style={styles.errorText}>{errorNombre}</Text> : null}
        </View>
        <View style={styles.cajaTexto}>
            <TextInput placeholder="Apellido" style={[styles.input, { paddingHorizontal: 15 }]}
                value={apellido} onChangeText={handleApellidoChange}/>
            {errorApellido ? <Text style={styles.errorText}>{errorApellido}</Text> : null}
        </View>
        <View style={styles.cajaTexto}>
            <TextInput placeholder="Correo" style={[styles.input, { paddingHorizontal: 15 }]}
                value={email} onChangeText={handleEmailChange}/>
            {errorEmail ? <Text style={styles.errorText}>{errorEmail}</Text> : null}
        </View>
        <View style={styles.cajaTexto}>
            <TextInput placeholder="Teléfono" style={[styles.input, { paddingHorizontal: 15 }]}
                value={telefono} onChangeText={handleTelefonoChange}
                keyboardType="phone-pad"/>
            {errorTelefono ? <Text style={styles.errorText}>{errorTelefono}</Text> : null}
        </View>

        {comunaSeleccionada === "" && <Text style={styles.errorText}>Debe seleccionar una comuna</Text>}

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
                        <Picker.Item key={index} label={comuna} value={comuna}/>
                    ))}
                </Picker>
            </View>
        ) : (
            <Text>No hay comunas disponibles</Text>
        )}

        <View style={styles.cajaTexto}>
            <TextInput placeholder="Direccion" style={[styles.input, { paddingHorizontal: 15 }]}
                value={direccion} onChangeText={handleDireccionChange}/>
            {errorDireccion ? <Text style={styles.errorText}>{errorDireccion}</Text> : null}
        </View>

        <TouchableOpacity style={styles.button} onPress={guardarDatosEnvio}>
            <Text style={styles.buttonText}>Proceder al Pago</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.regresarButton} onPress={regresar}>
            <Text style={styles.buttonText}>Regresar</Text>
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
        borderRadius: 5,
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
        marginTop: 1,
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
    regresarButton: {
        backgroundColor: 'grey',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        marginTop: 5,
        textAlign: 'left',
    },
    
});

export default FormularioCompra;