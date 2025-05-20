import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hotwheels-1-dkgkfbcsa7gjedh9.brazilsouth-01.azurewebsites.net',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Interceptor para tratamento global de erros
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Tratar erros de autenticação
    }
    
    return Promise.reject(error);
  }
);

export default api;