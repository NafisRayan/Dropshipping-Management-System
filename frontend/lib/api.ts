import axios from 'axios';

// Dynamic API URL detection
let API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Try to detect backend port dynamically
if (typeof window !== 'undefined') {
  // Client-side detection
  const detectBackendUrl = async () => {
    const commonPorts = [3001, 3002, 3003, 3004, 3005];
    
    for (const port of commonPorts) {
      try {
        const response = await fetch(`http://localhost:${port}/api-json`, {
          method: 'GET',
          mode: 'cors',
        });
        if (response.ok) {
          API_BASE_URL = `http://localhost:${port}`;
          api.defaults.baseURL = API_BASE_URL;
          console.log(`🔗 Connected to backend at ${API_BASE_URL}`);
          break;
        }
      } catch (error) {
        continue;
      }
    }
  };
  
  // Run detection on client load
  detectBackendUrl();
}

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Function to update API base URL
export const updateApiBaseUrl = (newUrl: string) => {
  API_BASE_URL = newUrl;
  api.defaults.baseURL = newUrl;
};

// Function to get current API URL
export const getApiBaseUrl = () => API_BASE_URL;

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (userData: any) =>
    api.post('/auth/register', userData),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id: number) => api.get(`/users/${id}`),
  update: (id: number, data: any) => api.patch(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};

// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id: number) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: number, data: any) => api.patch(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
  updateStock: (id: number, quantity: number) =>
    api.patch(`/products/${id}/stock`, { quantity }),
};

// Suppliers API
export const suppliersAPI = {
  getAll: () => api.get('/suppliers'),
  getById: (id: number) => api.get(`/suppliers/${id}`),
  create: (data: any) => api.post('/suppliers', data),
  update: (id: number, data: any) => api.patch(`/suppliers/${id}`, data),
  delete: (id: number) => api.delete(`/suppliers/${id}`),
};

// Orders API
export const ordersAPI = {
  getAll: (userId?: number) => api.get('/orders', { params: { userId } }),
  getById: (id: number) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders', data),
  update: (id: number, data: any) => api.patch(`/orders/${id}`, data),
  updateStatus: (id: number, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
  delete: (id: number) => api.delete(`/orders/${id}`),
};

// Customers API
export const customersAPI = {
  getAll: () => api.get('/customers'),
  getById: (id: number) => api.get(`/customers/${id}`),
  getStats: (id: number) => api.get(`/customers/${id}/stats`),
  create: (data: any) => api.post('/customers', data),
  update: (id: number, data: any) => api.patch(`/customers/${id}`, data),
  delete: (id: number) => api.delete(`/customers/${id}`),
};

// Reports API
export const reportsAPI = {
  getDashboard: () => api.get('/reports/dashboard'),
  getSales: (startDate?: string, endDate?: string) => 
    api.get('/reports/sales', { params: { startDate, endDate } }),
  getInventory: () => api.get('/reports/inventory'),
  getSuppliers: () => api.get('/reports/suppliers'),
};

// Notifications API
export const notificationsAPI = {
  getAlerts: () => api.get('/notifications/alerts'),
  getLowStock: () => api.get('/notifications/low-stock'),
  getPendingOrders: () => api.get('/notifications/pending-orders'),
  sendLowStockEmail: (data: any) => api.post('/notifications/send-low-stock-email', data),
  sendOrderConfirmation: (data: any) => api.post('/notifications/send-order-confirmation', data),
  sendShippingNotification: (data: any) => api.post('/notifications/send-shipping-notification', data),
};