// src/services/api.js
const API_BASE = process.env.VITE_API_URL

class ApiService {
  // Auth endpoints
  async login(credentials) {
    return axios.post(`${API_BASE}/auth/login`, credentials)
  }
  
  // Product endpoints
  async getProducts(filters = {}) {
    return axios.get(`${API_BASE}/products`, { params: filters })
  }
  
  // Cart endpoints
  async addToCart(productId, quantity) {
    return axios.post(`${API_BASE}/cart`, { productId, quantity })
  }
  
  // Order endpoints
  async placeOrder(orderData) {
    return axios.post(`${API_BASE}/orders`, orderData)
  }
}
