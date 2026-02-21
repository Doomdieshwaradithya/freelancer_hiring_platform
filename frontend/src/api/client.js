import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://freelancer-hiring-platform-6.onrender.com';
const API_BASE = `${API_URL}/api`;
console.log('API_DEBUG: Initializing with BASE URL:', API_BASE);

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
