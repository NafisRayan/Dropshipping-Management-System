import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'
import { authApi } from '@/lib/api'
import type { User, AuthState, LoginCredentials, RegisterCredentials } from '@/types/auth'

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user: User | null) => set({ user }),
      setToken: (token: string | null) => {
        set({ token })
        if (token) {
          Cookies.set('auth-token', token, { expires: 7 })
        } else {
          Cookies.remove('auth-token')
        }
      },

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true })
        try {
          const response = await authApi.login(credentials)
          const { access_token, user } = response.data
          
          set({
            user,
            token: access_token,
            isAuthenticated: true,
            isLoading: false,
          })
          
          Cookies.set('auth-token', access_token, { expires: 7 })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true })
        try {
          const response = await authApi.register(credentials)
          const { access_token, user } = response.data
          
          set({
            user,
            token: access_token,
            isAuthenticated: true,
            isLoading: false,
          })
          
          Cookies.set('auth-token', access_token, { expires: 7 })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        try {
          await authApi.logout()
        } catch (error) {
          // Ignore logout API errors
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          })
          Cookies.remove('auth-token')
          window.location.href = '/login'
        }
      },

      initialize: async () => {
        const token = Cookies.get('auth-token')
        if (token) {
          set({ isLoading: true })
          try {
            const response = await authApi.getProfile()
            const user = response.data
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            })
          } catch (error) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            })
            Cookies.remove('auth-token')
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export const useAuth = () => {
  const store = useAuthStore()
  
  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    login: store.login,
    register: store.register,
    logout: store.logout,
    setUser: store.setUser,
    setToken: store.setToken,
    initialize: store.initialize,
  }
}