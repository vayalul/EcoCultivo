import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { updateDoc, doc } from '@react-native-firebase/firestore';
import { db } from '../credenciales';

const ResumenCompra = ({ route }) => {
  const { productosCarrito } = route.params;
  const [productos, setProductos] = useState(productosCarrito);
  const navigation = useNavigation();

  const handlePagar = async () => {
    try {
      for (const producto of productos) { // Verificamos el stock del producto en la bd
        const productoRef = doc(db, 'productos', producto.id);
        const productoSnapshot = await getDoc(productoRef);
        const productoData = productoSnapshot.data();

        if (productoData.cantidad < producto.cantidad) {
          Alert.alert(
            'Mercado EcoCultivo',
            'No hay suficiente stock para ${producto.nombre}',
            [{ text: 'Aceptar'}]
          );
          return; // Detenemos el proceso si no hay stock
        }
      }
      navigation.navigate('FormularioCompra');
    } catch (error) {
      console.error('Error al verificar el stock:', error);
      Alert.alert(
        'Mercado EcoCultivo', 
        'Hubo un problema al realizar la compra. Inténtalo nuevamente.', 
        [{ text: 'Aceptar' }]);
    }
  }

  const incrementarCantidad = (productoId) => {
    setProductos((prev) =>
      prev.map((producto) =>
        producto.id === productoId
          ? { ...producto, cantidad: producto.cantidad + 1 }
          : producto
      )
    );
  };

  const decrementarCantidad = (productoId) => {
    setProductos((prev) =>
      prev.map((producto) =>
        producto.id === productoId && producto.cantidad > 1
          ? { ...producto, cantidad: producto.cantidad - 1 }
          : producto
      )
    );
  };

  const eliminarProducto = (productoId) => {
    setProductos((prev) => {
      const productosActualizados = prev.filter((producto) => producto.id !== productoId);
      if (productosActualizados.length === 0) {
        setTimeout(() => handleVolver(), 0);
      }
      return productosActualizados;
    });
  };

  const calcularEnvio = () => 3000;

  const calcularTotal = () =>
    productos.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0) + calcularEnvio();

  const handleElegirMasProductos = () => {
    navigation.navigate('Mercado');
  }

  const handleVolver = () => {
    Alert.alert(
      'Mercado EcoCultivo',
      'No hay productos en el carrito.',
      [{ text: 'Volver', onPress: () => navigation.navigate('Mercado') }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumen de Compra</Text>

      <View style={styles.header}>
        <Text style={styles.headerText}>Productos</Text>
        <Text style={styles.headerText}>Precio</Text>
        <Text style={styles.headerText}>Cantidad</Text>
        <Text style={styles.headerText}>Eliminar</Text>
      </View>

      <View style={styles.separator} />

      {productos.map((producto) => (
        <View key={producto.id} style={styles.productRow}>
          <Image source={{ uri: producto.imagen }} style={styles.productImage} />
          <Text style={styles.productPrice}>{producto.precio}</Text>

          <View style={styles.quantityControls}>
            <TouchableOpacity
              onPress={() => decrementarCantidad(producto.id)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{producto.cantidad}</Text>
            <TouchableOpacity
              onPress={() => incrementarCantidad(producto.id)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => eliminarProducto(producto.id)} style={styles.eliminarButton}>
            <Text style={styles.eliminarButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.subtotalRow}>
        <Text style={styles.subtotalText}>SubTotal:</Text>
        <Text style={styles.subtotalText}>
          ${productos.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0)}
        </Text>
      </View>

      <View style={styles.envioRow}>
        <Text style={styles.envioText}>Envío:</Text>
        <Text style={styles.envioText}>${calcularEnvio()}</Text>
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalText}>${calcularTotal()}</Text>
      </View>

      <View>
        <TouchableOpacity style={styles.botonPagar} onPress={handlePagar}>
                <Text style={styles.textoPagar}>Proceder al Pago</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity style={styles.botonElegirProductos} onPress={handleElegirMasProductos}>
                <Text style={styles.textoElegirProductos}>Elegir Más Productos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        paddingTop: 30,
        marginBottom: 20,
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginVertical: 10,
    },
    productRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    productImage: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    quantity: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    eliminarButton: {
        marginLeft: 10,
        backgroundColor: '#ff4d4d',
        padding: 10,
        borderRadius: 5,
    },
    eliminarButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    subtotalRow: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 10,
    },
    totalRow: {
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: '#ccc',
      paddingTop: 10,
  },
  envioRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
},
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    botonElegirProductos: {
        backgroundColor: 'grey',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 5,
        marginTop: 10,
    },
    textoElegirProductos: {
        color: '#fff',
        fontWeight: 'light',
        fontSize: 18,
        textAlign: 'center',
    },
    botonPagar: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 5,
        marginTop: 10,
    },
    textoPagar: {
        textAlign: 'center',
        fontWeight: 'light',
        color: '#fff',
        fontSize: 18,
    },
});

export default ResumenCompra;