import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Button, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db } from '../credenciales';
import { collection, getDocs } from 'firebase/firestore';
import { iniciarPago } from '../transbank';

const ProductoItem = ({ producto, agregarAlCarrito }) => (
  <View style={styles.productoContainer}>
    <Image source={{ uri: producto.imagen }} style={styles.imagenCultivo} />
    <Text style={styles.nombre}>{producto.nombre}</Text>
    <Text style={styles.precio}>{producto.precio}</Text>
    <Button title="Agregar al Carrito" onPress={() => agregarAlCarrito(producto)} />
  </View>
);

const Mercado = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [carritoVisible, setCarritoVisible] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const productosSnapshot = await getDocs(collection(db, 'Productos'));
        const productosList = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProductos(productosList);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
    fetchProductos();
  }, []);

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  const handleComprar = async () => {
    try {
      const montoTotal = carrito.reduce((total, producto) => total + parseFloat(producto.precio), 0);
      const response = await iniciarPago(montoTotal, carrito);
      console.log("Respuesta del pago:", response);
    } catch (error) {
      console.error("Error al procesar el pago:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {productos.length === 0 ? (
        <Text>No hay productos disponibles</Text>
      ) : (
        <FlatList
          data={productos}
          renderItem={({ item }) => <ProductoItem producto={item} agregarAlCarrito={agregarAlCarrito} />}
          keyExtractor={(item) => item.id}
        />
      )}
      <TouchableOpacity onPress={() => setCarritoVisible(true)}>
        <Text style={styles.carritoButton}>Ver Carrito ({carrito.length})</Text>
      </TouchableOpacity>

      <Modal visible={carritoVisible} animationType="slide" transparent={true}>
        <View style={styles.carritoContainer}>
          <Text style={styles.carritoTitulo}>Carrito de Compras</Text>
          {carrito.length > 0 ? (
            <FlatList
              data={carrito}
              renderItem={({ item }) => (
                <View style={styles.carritoItem}>
                  <Text>{item.nombre}</Text>
                  <Text>{item.precio}</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <Text>Tu carrito está vacío</Text>
          )}
          <Button title="Comprar" onPress={handleComprar} />
          <Button title="Cerrar Carrito" onPress={() => setCarritoVisible(false)} />
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
  productoContainer: { 
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  imagenCultivo: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  precio: {
    fontSize: 14,
    color: 'green',
  },
  carritoButton: {
    color: 'white', 
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 20,
    backgroundColor: 'green', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center',
  },
  carritoContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    marginTop: 'auto',
  },
  carritoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  carritoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});

export default Mercado;
