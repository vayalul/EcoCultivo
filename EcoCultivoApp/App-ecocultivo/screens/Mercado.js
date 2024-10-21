import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Button, Modal, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome'; // Asegúrate de tener este paquete instalado

// URL del logo de la app
const logoApp = require('../assets/Logo.png'); // Asegúrate de usar require para imágenes locales

// Ejemplo de lista de productos
const initialProductos = [
  { id: '1', nombre: 'Semillas de tomate', precio: '5.000', imagen: logoApp },
  { id: '2', nombre: 'Fertilizante', precio: '8.000', imagen: logoApp },
  { id: '3', nombre: 'Tijeras de podar', precio: '14.000', imagen: logoApp },
  // Agrega más productos según sea necesario
];

// Componente para cada producto
const ProductoItem = ({ producto }) => (
  <View style={styles.productoContainer}>
    <Image source={producto.imagen} style={styles.imagen} />
    <Text style={styles.nombre}>{producto.nombre}</Text>
    <Text style={styles.precio}>${producto.precio}</Text>
  </View>
);

// Componente principal de mercado
const Mercado = () => {
  const [productos, setProductos] = useState(initialProductos);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState('');

  const agregarProducto = () => {
    const nuevoProducto = {
      id: (productos.length + 1).toString(),
      nombre,
      precio,
      imagen,
    };
    setProductos([...productos, nuevoProducto]);
    setNombre('');
    setPrecio('');
    setImagen('');
    setModalVisible(false);
  };

  const seleccionarImagen = () => {
    // Aquí puedes implementar la lógica para seleccionar una imagen
    setImagen('../assets/Logo.png'); // Cambia esto por la lógica para seleccionar la imagen
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mercado</Text>
        <TouchableOpacity style={styles.cartButton}>
          <Icon name="shopping-cart" size={25} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={productos}
        renderItem={({ item }) => <ProductoItem producto={item} />}
        keyExtractor={(item) => item.id}
      />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Producto</Text>
            <TextInput
              placeholder="Nombre del Producto"
              value={nombre}
              onChangeText={setNombre}
              style={styles.input}
            />
            <TextInput
              placeholder="Precio"
              value={precio}
              onChangeText={setPrecio}
              keyboardType="numeric"
              style={styles.input}
            />
            <TouchableOpacity style={styles.imageButton} onPress={seleccionarImagen}>
              <Icon name="upload" size={25} color={"white"} />
              <Text style={styles.imageButtonText}> Subir Imagen</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              <Button title="Agregar" onPress={agregarProducto} color={"green"} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} color={"red"} />
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.footer}>
        <Button title="Agregar Producto" onPress={() => setModalVisible(true)} color={'green'}/>
      </View>
    </SafeAreaView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cartButton: {
    padding: 10,
  },
  productoContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
  },
  imagen: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  precio: {
    fontSize: 16,
    color: '#888',
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
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '100%',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    justifyContent: 'center',
  },
  imageButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: 'white',
  },
  footer: {
    justifyContent: 'flex-end',
    marginBottom: 20, // Espacio desde el fondo
    alignItems: 'center', // Centrar el botón
  },
});

export default Mercado;
