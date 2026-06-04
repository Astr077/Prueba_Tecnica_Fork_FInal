import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 5000,
});

// Interceptor para inyectar automáticamente el token JWT en las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('catalogo-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Endpoints de autenticación
export async function login(username, password) {
  return api.post('/auth/login', { username, password });
}

export async function register(username, password) {
  return api.post('/auth/register', { username, password });
}

// Endpoints de productos
export async function getProducts(filters = {}) {
  const query = new URLSearchParams();
  if (filters.search) query.append('search', filters.search);
  if (filters.tipo) query.append('tipo', filters.tipo);
  if (filters.minPrecio !== undefined && filters.minPrecio !== '') {
    query.append('minPrecio', filters.minPrecio);
  }
  if (filters.maxPrecio !== undefined && filters.maxPrecio !== '') {
    query.append('maxPrecio', filters.maxPrecio);
  }

  const url = `/products${query.toString() ? `?${query.toString()}` : ''}`;
  return api.get(url);
}

export async function createProduct(product) {
  return api.post('/products', product);
}

export async function updateProduct(id, product) {
  return api.put(`/products/${id}`, product);
}

export async function deleteProduct(id) {
  return api.delete(`/products/${id}`);
}

// Endpoints de gestión de usuarios (solo admin)
export async function getUsers() {
  return api.get('/auth/users');
}

export async function adminCreateUser(userData) {
  return api.post('/auth/users', userData);
}

export async function deleteUser(id) {
  return api.delete(`/auth/users/${id}`);
}

