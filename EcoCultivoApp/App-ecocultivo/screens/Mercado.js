import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal, Button, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../credenciales';
import { collection, getDocs } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PAGE_SIZE = 6;

const ProductoItem = ({ producto, onComprar }) => (
  <View style={styles.productoContainer}>
    <Image source={{ uri: producto.imagen }} style={styles.imagenProducto} />
    <Text style={styles.nombreProducto} numberOfLines={1} ellipsizeMode="tail">
      {producto.nombre}
    </Text>
    {producto.precio !== undefined && (
      <Text style={styles.precioProducto}>{$${producto.precio}}</Text>
    )}
    <TouchableOpacity onPress={() => onComprar(producto)} style={styles.botonComprar}>
      <Text style={styles.textoBoton}>Añadir</Text>
    </TouchableOpacity>
  </View>
);

const Mercado = () => {
  const [productos, setProductos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productosCarrito, setProductosCarrito] = useState([]);
  
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

  const handleComprar = (producto) => {
    setProductosCarrito((prev) => [...prev, producto]); // Añade el producto al carrito
    setIsModalVisible(true); // Abre el modal del carrito
  };

  const totalPages = Math.ceil(productos.length / PAGE_SIZE);
  const paginatedProductos = productos.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleCerrarCarrito = () => {
    setIsModalVisible(false); // Cierra el modal del carrito
  };

  const handleComprarFinal = () => {
    // Luego agregamos la lógica para procesar la compra
    alert("Compra procesada con éxito!");
    setIsModalVisible(false);
    setProductosCarrito([]); // Se vacía el carrito después de la compra
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Contenedor para centrar titulo y abrir ícono del carrito */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Mercado</Text>
        <TouchableOpacity style={styles.botonCarrito} onPress={() => setIsModalVisible(true)}>
          <Text> {/* Envolvemos el icono dentro de un Text si es necesario */}
            <Icon name="shopping-cart" size={30} color="white" />
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de productos */}
      <FlatList
        data={paginatedProductos}
        renderItem={({ item }) => <ProductoItem producto={item} onComprar={handleComprar} />}
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

      {/* Modal de carrito (Desliza desde el lado derecho) */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCerrarCarrito}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Carrito de Compras</Text>
            <ScrollView style={styles.scrollContainer}>
            {productosCarrito.length > 0 ? (
              productosCarrito.map((producto) => (
                <View key={producto.id} style={styles.productoEnCarrito}>
                  <Image source={{ uri: producto.imagen }} style={styles.imagenProductoCarrito} />
                      <Text>{producto.nombre}</Text>
                      <Text>{`$${producto.precio}`}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text>No hay productos en el carrito.</Text>
              )}
            </ScrollView>
            <View style={styles.modalButtons}>
              <Button title="Cerrar carrito" onPress={handleCerrarCarrito} />
              <TouchableOpacity style={styles.botonComprarFinal} onPress={handleComprarFinal}>
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
    backgroundColor: '#f0f8f0',
  },
  headerContainer: {
    flexDirection: 'row', // Alinea el texto y el ícono horizontalmente
    justifyContent: 'space-between', // Espacio entre los elementos
    alignItems: 'center', // Centra los elementos verticalmente
    marginTop: 10, // Margen superior para separar del borde
    marginBottom: 20, // Separación con el contenido siguiente
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
  // Estilos para Modal del carrito de compras
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '60%', // Espacio que ocupa el carrito, ajustable a nuestro gusto
    height: '100%', // Ocupa toda la altura de la pantalla
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 20,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  modalTitle: {
    paddingTop: 40,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  productoEnCarrito: {
    paddingTop: 10,
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  imagenProductoCarrito: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  infoProducto: {
    flex: 1,
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
});

export default Mercado; 