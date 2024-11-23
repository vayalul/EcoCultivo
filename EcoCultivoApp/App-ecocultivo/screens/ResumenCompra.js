import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ResumenCompra = ({ route }) => {
    const { productosCarrito, setProductosCarrito } = route.params;

    const incrementarCantidad = (productoId) => {
        setProductosCarrito((prev) =>
            prev.map((producto) =>
                producto.id === productoId
                    ? { ...producto, cantidad: producto.cantidad + 1 }
                    : producto
            )
        );
    };

    const decrementarCantidad = (productoId) => {
        setProductosCarrito((prev) =>
            prev.map((producto) =>
                producto.id === productoId && producto.cantidad > 1
                    ? { ...producto, cantidad: producto.cantidad - 1 }
                    : producto
            )
        );
    };

    const calcularTotal = () =>
        productosCarrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
    };

    return (
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>Producto</Text>
            <Text style={styles.headerText}>Cantidad</Text>
            <Text style={styles.headerText}>Precio</Text>
          </View>
          <View style={styles.separator} />
    
          {productosCarrito.map((producto) => (
            <View key={producto.id} style={styles.productRow}>
              <View style={styles.productColumn}>
                <Image source={{ uri: producto.imagen }} style={styles.productImage} />
              </View>
    
              <View style={styles.quantityColumn}>
                <TouchableOpacity onPress={() => decrementarCantidad(producto.id)} style={styles.button}>
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{producto.cantidad}</Text>
                <TouchableOpacity onPress={() => incrementarCantidad(producto.id)} style={styles.button}>
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
    
              <View style={styles.priceColumn}>
                <Text style={styles.priceText}>${producto.precio}</Text>
              </View>
            </View>
          ))}
        </View>
      );
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
      },
      headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
      },
      headerText: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
      },
      productRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
      },
      productColumn: {
        flex: 1,
        alignItems: 'center',
      },
      productImage: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
      },
      quantityColumn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
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
      quantityText: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      priceColumn: {
        flex: 1,
        alignItems: 'center',
      },
      priceText: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    });
    
    export default ResumenCompra;