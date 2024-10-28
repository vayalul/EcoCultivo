import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native';
import getClima from '../clima';
import { auth }  from '../credenciales';

const Home = () => {
    const [clima, setClima] = useState(null);
    const [nombreUsuario, setNombreUsuario] = useState('');

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setNombreUsuario(user.displayName || user.email);
        }

        const fetchClima = async () => {
            try {
                const climaData = await getClima();
                setClima(climaData);
            } catch (error) {
                console.error('Error al obtener el clima:', error);
            }
        };
        fetchClima();
    }, []);

    
    const iconUrl = clima ? `http://openweathermap.org/img/wn/${clima.weather[0].icon}@2x.png` : '';

    return (
        <View style={styles.container}>
            {clima ? (
                <>
                    <Text style={styles.welcomeText}>
                        Bienvenido {nombreUsuario}
                    </Text>
                    <Text style={styles.climaText}>
                        El clima de hoy es {Math.round(clima.main.temp)}°C
                    </Text>
                    {iconUrl ? (
                        <Image
                            source={{ uri: iconUrl }}
                            style={styles.weatherIcon}
                            resizeMode="contain"
                        />
                    ) : (
                        <Text style={styles.text}>Ícono no disponible</Text>
                    )}
                </>
            ) : (
                <Text style={styles.text}>Cargando clima...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'black',
    },
    climaText: {
        fontSize: 18,
        color: 'black',
        marginVertical: 10, // Espaciado entre el texto y el icono
    },
    weatherIcon: {
        width: 100, // Ajusta el tamaño según sea necesario
        height: 100, // Ajusta el tamaño según sea necesario
    },
});

export default Home;