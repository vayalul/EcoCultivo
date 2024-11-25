import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ResumenCompra = ({ route }) => {
    const { productosCarrito, setProductosCarrito } = useContext(CarritoContext);

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

    const calcularEnvio = () => 3000;

    const calcularTotal = () =>
        productosCarrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0) + calcularEnvio();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Resumen de Compra</Text>

            <View style={styles.header}>
                <Text style={styles.headerText}>Productos</Text>
                <Text style={styles.headerText}>Precio</Text>
                <Text style={styles.headerText}>Cantidad</Text>
            </View>

            <View style={styles.separator} />

            {productosCarrito.map((producto) => (
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
                </View>
            ))}

            <View style={styles.subtotalRow}>
                <Text style={styles.subtotalText}>SubTotal:</Text>
                <Text style={styles.subtotalText}>
                  ${productosCarrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0)}
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
});

export default ResumenCompra;
