import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal, Button, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../credenciales';
import { collection, getDocs, Firestore } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const PAGE_SIZE = 6;

const ProductoItem = ({ producto, onComprar }) => (
  <View style={styles.productoContainer}>
    <Image source={{ uri: producto.imagen }} style={styles.imagenProducto} />
    <Text style={styles.nombreProducto} numberOfLines={1} ellipsizeMode="tail">
      {producto.nombre}
    </Text>
    {producto.precio !== undefined && (
      <Text style={styles.precioProducto}>${producto.precio}</Text>
    )}
    <TouchableOpacity onPress={() => onComprar(producto)} style={styles.botonComprar}>
      <Text style={styles.textoBoton}>Añadir</Text>
    </TouchableOpacity>
  </View>
);

const Mercado = () => {
  const [productos, setProductos] = useState([]);
  const [productosCarrito, setProductosCarrito] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const productosSnapshot = await getDocs(collection(db, 'productos'));
        const productosList = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProductos(productosList);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
    fetchProductos();
  }, []);

  const handleAnadir = (producto) => {
    setProductosCarrito((prev) => {
      const index = prev.findIndex((p) => p.id === producto.id);
      if (index !== -1) {
        const updatedCarrito = [...prev];
        updatedCarrito[index].cantidad += 1;
        return updatedCarrito;
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
    setIsModalVisible(true);
  };

  const handleCerrarCarrito = () => {
    setIsModalVisible(false);
  };

  const handleIncrementar = (productoId) => {
    setProductosCarrito((prev) =>
      prev.map((producto) =>
        producto.id === productoId
          ? { ...producto, cantidad: producto.cantidad + 1 }
          : producto
      )
    );
  };

  const handleDecrementar = (productoId) => {
    setProductosCarrito((prev) =>
      prev
        .map((producto) =>
          producto.id === productoId && producto.cantidad > 1
            ? { ...producto, cantidad: producto.cantidad - 1 }
            : producto
        )
        .filter((producto) => producto.cantidad > 0)
    );
  };

  const handleEliminar = (productoId) => {
    setProductosCarrito((prev) => prev.filter((producto) => producto.id !== productoId));
  };

  const handleComprar = () => {
    if (productosCarrito.length === 0) {
      Alert.alert(
        'Mercado EcoCultivo',
        'El carrito está vacío. Seleccione al menos un producto para continuar.',
        [{ text: 'Aceptar'}]
      );
      return;
    }
    navigation.navigate('ResumenCompra', { productosCarrito });
  };

  const totalPages = Math.ceil(productos.length / PAGE_SIZE);
  const paginatedProductos = productos.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Mercado</Text>
        <TouchableOpacity style={styles.botonCarrito} onPress={() => setIsModalVisible(true)}>
          <Icon name="shopping-cart" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={paginatedProductos}
        renderItem={({ item }) => <ProductoItem producto={item} onComprar={handleAnadir} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.filaProductos}
        contentContainerStyle={styles.listaProductos}
      />

      <View style={styles.paginationContainer}>
        {Array.from({ length: totalPages }, (_, index) => (
          <TouchableOpacity
            key={index + 1}
            style={[styles.pageButton, currentPage === index + 1 && styles.activePageButton]}
            onPress={() => setCurrentPage(index + 1)}
          >
            <Text style={styles.pageButtonText}>{index + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={isModalVisible} animationType="slide" transparent={true} onRequestClose={handleCerrarCarrito}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Carrito de Compras</Text>
            <ScrollView style={styles.scrollContainer}>
              {productosCarrito.length > 0 ? ( 
                productosCarrito.map((producto) => (
                  <View key={producto.id} style={styles.productoEnCarrito}>
                    <Image source={{ uri: producto.imagen }} style={styles.imagenProductoCarrito} />
                    <View style={styles.infoProducto}>
                      <Text>{producto.nombre}</Text>
                      <Text>${producto.precio * producto.cantidad}</Text>
                      <TouchableOpacity onPress={() => handleEliminar(producto.id)} style={styles.botonEliminar}>
                        <Text style={styles.textoBotonEliminar}>Eliminar</Text>
                      </TouchableOpacity>
                      <View style={styles.contadorContainer}>
                        <TouchableOpacity
                          onPress={() => handleDecrementar(producto.id)}
                          style={styles.botonContador}
                        >
                          <Text style={styles.textoContador}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.cantidadTexto}>{producto.cantidad}</Text>
                        <TouchableOpacity
                          onPress={() => handleIncrementar(producto.id)}
                          style={styles.botonContador}
                        >
                          <Text style={styles.textoContador}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <Text>No hay productos en el carrito.</Text>
              )}
            </ScrollView>
            <View style={styles.modalButtons}>
              <Text>Total: ${productosCarrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0)}</Text> 
              <Button title="Cerrar carrito" onPress={handleCerrarCarrito} />
              <TouchableOpacity style={styles.botonComprarFinal} onPress={handleComprar}>
                <Text style={styles.textoBotonFinal}>Comprar</Text>
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
    padding: 0,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 10, 
    marginBottom: 20, 
  },
  botonCarrito: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
    paddingLeft: 10,
  },
  listaProductos: {
    paddingBottom: 20,
  },
  filaProductos: {
    justifyContent: 'center',
  },
  productoContainer: {
    alignItems: 'center',
    margin: 5,
    padding: 10,
    width: 160,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  imagenProducto: {
    width: 90,
    height: 90,
    borderRadius: 5,
    marginBottom: 10,
  },
  nombreProducto: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  precioProducto: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  botonComprar: {
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'light',
    fontSize: 16,
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  pageButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  activePageButton: {
    backgroundColor: 'green',
  },
  pageButtonText: {
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '60%',
    height: '100%',
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 20,
    borderTopLeftRadius: 10,
  },
  modalTitle: {
    marginTop: 40,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  scrollContainer: {
    marginBottom: 20,
  },
  productoEnCarrito: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  imagenProductoCarrito: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  infoProducto: {
    flex: 1,
  },
  botonEliminar: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotonEliminar: {
    color: 'white',
    fontWeight: 'bold',
  },
  contadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  botonContador: {
    backgroundColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  textoContador: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cantidadTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  modalButtons: {
    marginTop: 20,
    alignItems: 'center',
  },
  botonComprarFinal: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 10,
  },
  textoBotonFinal: {
    color: 'white',
    fontSize: 18,
  },
  botonCarrito: {
    position: 'absolute',
    bottom: 5,
    right: 20,
    backgroundColor: 'green',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Mercado; 