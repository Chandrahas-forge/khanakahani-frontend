import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AuthenticationApi, Configuration } from '@/api'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000' // Replace with your API URL

export const useAuthStore = defineStore('auth', () => {
  // Initialize from localStorage
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const isAuthenticated = ref(!!localStorage.getItem('token'))
  const errors = ref({})
  const token = ref(localStorage.getItem('token'))

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    return password.length >= 6
  }

  const validateForm = (email, password, isLogin = true) => {
    errors.value = {}
    
    if (!email) {
      errors.value.email = 'Email is required'
    } else if (!validateEmail(email)) {
      errors.value.email = 'Please enter a valid email address'
    }

    if (!password) {
      errors.value.password = 'Password is required'
    } else if (!validatePassword(password)) {
      errors.value.password = 'Password must be at least 6 characters long'
    }

    return Object.keys(errors.value).length === 0
  }

  const login = async (email, password) => {
    if (!validateForm(email, password)) {
      return false
    }

    try {
      const config = new Configuration({
        basePath: API_BASE_URL
      })
      const authApi = new AuthenticationApi(config)
      const response = await authApi.loginAuthLoginPost(email, password)
      
      token.value = response.data.access_token
      localStorage.setItem('token', token.value)
      
      // Store user data
      user.value = { email, id: response.data.user_id } // Adjust based on your API response
      localStorage.setItem('user', JSON.stringify(user.value))
      
      isAuthenticated.value = true
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      
      return true
    } catch (error) {
      console.error('Login error:', error)
      errors.value.general = 'Invalid email or password'
      return false
    }
  }

  const register = async (email, password) => {
    if (!validateForm(email, password, false)) {
      return false
    }

    try {
      const config = new Configuration({
        basePath: API_BASE_URL
      })
      const authApi = new AuthenticationApi(config)
      const response = await authApi.registerAuthRegisterPost({
        email,
        password
      })
      
      user.value = response.data
      isAuthenticated.value = true
      
      // After registration, login the user
      return await login(email, password)
    } catch (error) {
      errors.value.general = 'Registration failed. Please try again.'
      return false
    }
  }

  const logout = async () => {
    try {
      if (token.value) {
        const config = new Configuration({
          basePath: API_BASE_URL,
          accessToken: token.value
        })
        const authApi = new AuthenticationApi(config)
        await authApi.logoutAuthLogoutPost()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuthState()
    }
  }

  const clearAuthState = () => {
    user.value = null
    isAuthenticated.value = false
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
  }

  const initializeAuth = async () => {
    if (token.value) {
      try {
        isAuthenticated.value = true
        axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
        
        // Verify token and get fresh user data
        const config = new Configuration({
          basePath: API_BASE_URL,
          accessToken: token.value
        })
        const authApi = new AuthenticationApi(config)
        const response = await authApi.getCurrentUser() // Make sure this endpoint exists
        
        user.value = response.data
        localStorage.setItem('user', JSON.stringify(user.value))
      } catch (err) {
        console.error('Token validation failed:', err)
        clearAuthState()
      }
    }
  }

  // Add a method to check auth status
  const checkAuth = async () => {
    try {
      if (token.value) {
        const config = new Configuration({
          basePath: API_BASE_URL,
          accessToken: token.value
        })
        const authApi = new AuthenticationApi(config)
        const response = await authApi.getCurrentUser() // Assuming this endpoint exists
        user.value = response.data
      }
    } catch (err) {
      console.error('Auth check failed:', err)
      logout()
    }
  }

  return {
    user,
    isAuthenticated,
    errors,
    token,
    login,
    register,
    logout,
    validateForm,
    initializeAuth,
    checkAuth,
    clearAuthState
  }
})
