import axios from 'axios';
import * as Location from 'expo-location';

const API_KEY = '861f013b3351eca9b139f43cb502455d';

const getClima = async () => {
    try {
        // Solicitamos permiso para utilizar servicio de ubicacion
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error('Permiso para acceder a la ubicación denegado');
            return null;
        }

        // Obtener la ubicacion del usuario con latitud y longitud
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // Usamos las coordenadas para obtener el clima desde la API
        const URL = 
        const response = await axios.get(URL);
        return response.data;
    } catch (error) {
        console.error("Error al obtener el clima", error);
        return null;
    }
};

export default getClima;
