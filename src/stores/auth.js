import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AuthenticationApi, Configuration } from '@/api'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000' // Replace with your API URL

export const useAuthStore = defineStore('auth', () => {
  // State - use refs for mutable state
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const token = ref(localStorage.getItem('token'))
  const errors = ref({})

  // Remove userId computed property and use user.id directly
  const isAuthenticated = computed(() => !!token.value)

  const setUser = userData => {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const clearUser = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  // Current state helpers
  const getUserState = () => ({
    id: user.value?.id ?? null,
    email: user.value?.email,
    isAuthenticated: isAuthenticated.value
  })

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = password => {
    return password.length >= 6
  }

  const validateForm = (email, password) => { // Removed isLogin
    errors.value = {}  // Now errors is properly defined
    
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
      
      // Update token first
      token.value = response.data.access_token
      localStorage.setItem('token', token.value)
      
      // Update user data using ref, not computed
      const userData = { email, id: response.data.user_id }
      user.value = userData
      localStorage.setItem('user', JSON.stringify(userData))
      
      // Set axios headers after successful login
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      
      return true
    } catch (err) { // Changed from 'error' to 'err'
      console.error('Login error:', err) // Updated to use 'err'
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
      return true
    } catch (err) { // Changed from 'error' to 'err'
      // Consider logging the error or handling specific error cases
      console.error('Registration failed:', err) // Added error logging
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

  // Modify the checkAuth method
  const checkAuth = async () => {
    if (!token.value) {
      return
    }

    try {
      // Setup authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      
      // Get current user data from API
      const config = new Configuration({
        basePath: API_BASE_URL
      })
      const authApi = new AuthenticationApi(config)
      const response = await authApi.getCurrentUser()
      
      // Update user data if successful
      setUser(response.data)
    } catch (err) {
      console.error('Auth check failed:', err)
      
      // Explicitly call logout instead of clearAuthState
      await logout()
    }
  }

  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    errors,
    isAuthenticated,
    // Remove userId from returns
    setUser,
    clearUser,
    getUserState,
    login,
    register,
    logout,
    validateForm,
    initializeAuth,
    checkAuth,
    clearAuthState
  }
})
