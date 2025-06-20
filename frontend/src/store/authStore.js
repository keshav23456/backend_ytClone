import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'
import toast from 'react-hot-toast'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (credentials) => {
        try {
          const response = await api.post('/users/login', credentials)
          const { user, accessToken } = response.data.data
          
          localStorage.setItem('accessToken', accessToken)
          set({ user, isAuthenticated: true })
          toast.success('Login successful!')
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.message || 'Login failed'
          toast.error(message)
          return { success: false, message }
        }
      },

      register: async (userData) => {
        try {
          const response = await api.post('/users/register', userData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          toast.success('Registration successful! Please login.')
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.message || 'Registration failed'
          toast.error(message)
          return { success: false, message }
        }
      },

      logout: async () => {
        try {
          await api.post('/users/logout')
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          localStorage.removeItem('accessToken')
          set({ user: null, isAuthenticated: false })
          toast.success('Logged out successfully')
        }
      },

      checkAuth: async () => {
        try {
          const token = localStorage.getItem('accessToken')
          if (!token) {
            set({ isLoading: false })
            return
          }

          const response = await api.get('/users/current-user')
          const user = response.data.data
          set({ user, isAuthenticated: true, isLoading: false })
        } catch (error) {
          localStorage.removeItem('accessToken')
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },

      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)