import axios from 'axios';

const transbankApi = axios.create({
  baseURL: 'https://api.transbank.cl', // Revisa la URL base según tu ambiente
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer YOUR_API_KEY` // Coloca aquí tu API Key de Transbank
  },
});

export const iniciarPago = async (monto, carrito) => {
  try {
    const response = await transbankApi.post('/webpay-plus/create', {
      amount: monto,
      items: carrito,
    });
    return response.data;
  } catch (error) {
    console.error('Error al iniciar pago:', error);
    throw error;
  }
};
