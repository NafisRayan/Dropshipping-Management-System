import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('auth-token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  register: async (credentials: RegisterCredentials) => {
    const response = await api.post('/auth/register', credentials)
    return response.data
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  },

  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },
}

export const productsApi = {
  getAll: async (filters?: ProductFilter) => {
    const response = await api.get('/products', { params: filters })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  create: async (data: any) => {
    const response = await api.post('/products', data)
    return response.data
  },

  update: async (id: string, data: any) => {
    const response = await api.patch(`/products/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },

  getLowStock: async () => {
    const response = await api.get('/products/low-stock')
    return response.data
  },
}

export const ordersApi = {
  getAll: async () => {
    const response = await api.get('/orders')
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  create: async (data: CreateOrderData) => {
    const response = await api.post('/orders', data)
    return response.data
  },

  update: async (id: string, data: any) => {
    const response = await api.patch(`/orders/${id}`, data)
    return response.data
  },

  updateStatus: async (id: string, status: string, notes?: string) => {
    const response = await api.patch(`/orders/${id}/status`, { status, notes })
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/orders/${id}`)
    return response.data
  },

  getByStatus: async (status: string) => {
    const response = await api.get(`/orders/status/${status}`)
    return response.data
  },

  getByCustomer: async (customerId: string) => {
    const response = await api.get(`/orders/customer/${customerId}`)
    return response.data
  },
}

export const customersApi = {
  getAll: async () => {
    const response = await api.get('/customers')
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/customers/${id}`)
    return response.data
  },

  create: async (data: CreateCustomerData) => {
    const response = await api.post('/customers', data)
    return response.data
  },

  update: async (id: string, data: any) => {
    const response = await api.patch(`/customers/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/customers/${id}`)
    return response.data
  },

  search: async (query: string) => {
    const response = await api.get('/customers/search', { params: { q: query } })
    return response.data
  },

  addAddress: async (customerId: string, data: CreateAddressData) => {
    const response = await api.post(`/customers/${customerId}/addresses`, data)
    return response.data
  },

  updateAddress: async (customerId: string, addressId: string, data: any) => {
    const response = await api.patch(`/customers/${customerId}/addresses/${addressId}`, data)
    return response.data
  },

  deleteAddress: async (customerId: string, addressId: string) => {
    const response = await api.delete(`/customers/${customerId}/addresses/${addressId}`)
    return response.data
  },
}

export const analyticsApi = {
  getDashboardMetrics: async () => {
    const response = await api.get('/analytics/dashboard')
    return response.data
  },

  getRevenueAnalytics: async (days?: number) => {
    const response = await api.get('/analytics/revenue', { params: { days } })
    return response.data
  },

  getProductAnalytics: async () => {
    const response = await api.get('/analytics/products')
    return response.data
  },

  getCustomerAnalytics: async () => {
    const response = await api.get('/analytics/customers')
    return response.data
  },
}

// Type imports
import type { LoginCredentials, RegisterCredentials } from '@/types/auth'
import type { ProductFilter } from '@/types/product'
import type { CreateOrderData } from '@/types/order'
import type { CreateCustomerData, CreateAddressData } from '@/types/customer'