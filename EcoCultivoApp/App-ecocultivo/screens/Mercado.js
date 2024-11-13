import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../credenciales';
import { collection, getDocs } from 'firebase/firestore';

const PAGE_SIZE = 4; // Define cuántos productos se mostrarán por página

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
      <Text style={styles.textoBoton}>Comprar</Text>
    </TouchableOpacity>
  </View>
);

const Mercado = () => {
  const [productos, setProductos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

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
    console.log('Comprar producto:', producto.nombre);
  };

  // Filtrar productos para la página actual
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

      {/* Paginación */}
      <View style={styles.paginationContainer}>
        {Array.from({ length: totalPages }, (_, index) => (
          <TouchableOpacity
            key={index + 1}
            style={[
              styles.pageButton,
              currentPage === index + 1 && styles.activePageButton,
            ]}
            onPress={() => setCurrentPage(index + 1)}
          >
            <Text style={styles.pageButtonText}>{index + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
    marginBottom: 10,
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
    marginBottom: 10,
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
});

export default Mercado;