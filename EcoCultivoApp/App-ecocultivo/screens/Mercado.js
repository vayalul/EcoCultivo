import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal, Button, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../credenciales';
import { collection, getDocs } from 'firebase/firestore';


const PAGE_SIZE = 6;

const ProductoItem = ({ producto, onComprar }) => (
  <View style={styles.productoContainer}>
    <Image source={{ uri: producto.imagen }} style={styles.imagenProducto} />
    <Text style={styles.nombreProducto} numberOfLines={1} ellipsizeMode="tail">
      {producto.nombre}
    </Text>
    {producto.precio !== undefined && (
      <Text style={styles.precioProducto}>{`$${producto.precio}`}</Text>
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
    setProductosCarrito((prev) => {
      const index = prev.findIndex((p) => p.id === producto.id);
      if (index !== -1) {
        // Si el producto ya está en el carrito, incrementamos la cantidad
        const updatedCarrito = [...prev];
        updatedCarrito[index].cantidad += 1;
        return updatedCarrito;
      } else {
        // Si el producto no está en el carrito, lo agregamos con cantidad 1
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
    setIsModalVisible(true);
  };

  const handleCerrarCarrito = () => {
    setIsModalVisible(false);
  };

  const handleComprarFinal = () => {
    alert("Compra procesada con éxito!");
    setIsModalVisible(false);
    setProductosCarrito([]);
  };

  const handleEliminar = (productoId) => {
    setProductosCarrito((prev) => {
      const updatedCarrito = [...prev];
      const index = updatedCarrito.findIndex((producto) => producto.id === productoId);
      if (index !== -1) {
        if (updatedCarrito[index].cantidad > 1) {
          updatedCarrito[index].cantidad -= 1; // Decrementa la cantidad
        } else {
          updatedCarrito.splice(index, 1); // Elimina el producto si la cantidad es 1
        }
      }
      return updatedCarrito;
    });
  };

  const totalPages = Math.ceil(productos.length / PAGE_SIZE);
  const paginatedProductos = productos.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mercado</Text>
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

      {/* Botón para mostrar el carrito */}
      <TouchableOpacity style={styles.botonCarrito} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.textoBoton}>Ver Carrito</Text>
      </TouchableOpacity>

      {/* Modal de carrito */}
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
                      <Text>{`$${producto.precio} x${producto.cantidad}`}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleEliminar(producto.id)} style={styles.botonEliminar}>
                      <Text style={styles.textoBotonEliminar}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text>No hay productos en el carrito.</Text>
              )}
            </ScrollView>
            <View style={styles.modalButtons}>
              <Button title="Cerrar carrito" onPress={handleCerrarCarrito} />
              <TouchableOpacity style={styles.botonComprarFinal} onPress={handleComprarFinal}>
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
    backgroundColor: '#f0f8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
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
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  textoBotonEliminar: {
    color: 'white',
    fontWeight: 'bold',
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
    bottom: 20,
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
