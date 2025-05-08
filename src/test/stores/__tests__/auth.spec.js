import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { AuthenticationApi } from '@/api'
import axios from 'axios'

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString() },
    removeItem: key => { delete store[key] },
    clear: () => { store = {} }
  }
})()

// Mock API calls
vi.mock('@/api', () => {
  const Configuration = vi.fn()
  const AuthenticationApi = vi.fn()
    
  AuthenticationApi.prototype.loginAuthLoginPost = vi.fn()
  AuthenticationApi.prototype.registerAuthRegisterPost = vi.fn()
  AuthenticationApi.prototype.logoutAuthLogoutPost = vi.fn()
  AuthenticationApi.prototype.getCurrentUser = vi.fn()
    
  return {
    Configuration,
    AuthenticationApi
  }
})

// Replace global localStorage with mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
})

describe('Auth Tests', () => {
  // Define store at the describe level so it's available to all tests
  let authStore

  // Setup before each test
  beforeEach(() => {
    // Clear localStorage and reset mocks
    localStorage.clear()
    vi.resetAllMocks()
        
    // Create a fresh Pinia instance for each test
    setActivePinia(createPinia())
    authStore = useAuthStore()
        
    // Clear axios headers
    delete axios.defaults.headers.common['Authorization']
  })

  describe('Error Handling and Edge Cases', () => {

    it('should call logout when auth check fails', async () => {
      // Setup token and user data
      localStorage.setItem('token', 'invalid-token')
      localStorage.setItem('user', JSON.stringify({ id: 1, email: 'test@example.com' }))
            
      // Set headers for testing
      axios.defaults.headers.common['Authorization'] = 'Bearer invalid-token'
            
      // Create store with token
      setActivePinia(createPinia())
      authStore = useAuthStore()
            
      // Verify initial state
      expect(authStore.isAuthenticated).toBe(true)
      expect(authStore.token).toBe('invalid-token')
            
      // Mock API failure
      const authError = new Error('Unauthorized')
      authError.response = { status: 401 }
      AuthenticationApi.prototype.getCurrentUser.mockRejectedValueOnce(authError)
            
      // Mock console.error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            
      // Call the method that should trigger logout
      await authStore.checkAuth()
            
      // Instead of checking if logout was called directly, 
      // check if the effects of logout are visible:
      expect(authStore.isAuthenticated).toBe(false)
      expect(authStore.token).toBeNull()
      expect(authStore.user).toBeNull()
      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('should handle getUserState when user is null', () => {
      // Create a fresh store
      setActivePinia(createPinia())
      const store = useAuthStore()
            
      // Ensure user is null
      store.clearUser()
            
      // Get user state
      const state = store.getUserState()
            
      // Verify state has expected values for null user
      expect(state).toEqual({
        id: null,
        email: undefined,  // When user.value?.email runs with user.value as null, it returns undefined
        isAuthenticated: false
      })
    })
        
    it('should handle different error responses during login', async () => {
      // Mock a 401 Unauthorized error
      const unauthorizedError = new Error('Unauthorized')
      unauthorizedError.response = { status: 401, data: { detail: 'Invalid credentials' } }
      AuthenticationApi.prototype.loginAuthLoginPost.mockRejectedValueOnce(unauthorizedError)
            
      const result = await authStore.login('user@example.com', 'wrongpassword')
            
      expect(result).toBe(false)
      expect(authStore.errors.general).toBe('Invalid email or password')
    })

    it('should handle server errors during login', async () => {
      // Mock a 500 server error
      const serverError = new Error('Server Error')
      serverError.response = { status: 500 }
      AuthenticationApi.prototype.loginAuthLoginPost.mockRejectedValueOnce(serverError)
            
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            
      const result = await authStore.login('valid@example.com', 'password123')
            
      expect(result).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalled()
      expect(authStore.errors.general).toBe('Invalid email or password')
    })

    it('should handle network failures during login', async () => {
      // Mock a network error (no response property)
      const networkError = new Error('Network Error')
      AuthenticationApi.prototype.loginAuthLoginPost.mockRejectedValueOnce(networkError)
            
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            
      const result = await authStore.login('valid@example.com', 'password123')
            
      expect(result).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalled()
      expect(authStore.errors.general).toBe('Invalid email or password')
    })

    it('should handle null user data when returned from API', async () => {
      // Mock a valid login but with null user data
      AuthenticationApi.prototype.loginAuthLoginPost.mockResolvedValueOnce({
        data: {
          access_token: 'test-token',
          user_id: null
        }
      })
            
      const result = await authStore.login('user@example.com', 'password123')
            
      expect(result).toBe(true)
      expect(authStore.user).toEqual({ email: 'user@example.com', id: null })
    })
  })

  describe('User State Management', () => {
    it('should correctly initialize with data from localStorage', () => {
      // Setup localStorage with test data first
      const userData = { id: 123, email: 'test@example.com' }
      const tokenValue = 'mock-jwt-token'
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', tokenValue)
            
      // Re-create store to pick up localStorage values
      setActivePinia(createPinia())
      const newStore = useAuthStore()
            
      // Check that values were read correctly
      expect(newStore.token).toBe(tokenValue)
      expect(newStore.user).toEqual(userData)
      expect(newStore.isAuthenticated).toBe(true)
    })

    it('should remove user data and token from store and localStorage', () => {
      // Set up initial state
      const userData = { id: 1, email: 'test@example.com' }
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', 'test-token')
            
      // Re-create store to pick up localStorage values
      setActivePinia(createPinia())
      const newStore = useAuthStore()
            
      // Verify initial state
      expect(localStorage.getItem('user')).not.toBeNull()
            
      // Clear user
      newStore.clearUser()
            
      // Check everything is cleared
      expect(newStore.user).toBeNull()
      expect(newStore.token).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
      expect(localStorage.getItem('token')).toBeNull()
    })

    it('should return correct user state when user exists', () => {
      // Setup user data
      const userData = { id: 42, email: 'test@example.com', name: 'Test User' }
      localStorage.setItem('token', 'test-token')
      localStorage.setItem('user', JSON.stringify(userData))
            
      setActivePinia(createPinia())
      const storeWithUser = useAuthStore()
            
      // Check user state
      const state = storeWithUser.getUserState()
      expect(state).toEqual({
        id: 42,
        email: 'test@example.com',
        isAuthenticated: true
      })
    })

    it('should properly handle clearAuthState method', () => {
      // Setup auth state in localStorage
      localStorage.setItem('token', 'test-token')
      localStorage.setItem('user', JSON.stringify({ id: 1, email: 'test@example.com' }))
            
      // Set headers manually for testing
      axios.defaults.headers.common['Authorization'] = 'Bearer test-token'
            
      // Re-create store to pick up localStorage
      setActivePinia(createPinia())
      const store = useAuthStore()
            
      // Call clearAuthState
      store.clearAuthState()
            
      // Verify all auth state is cleared
      expect(store.token).toBeNull()
      expect(store.user).toBeNull() 
      expect(store.isAuthenticated).toBe(false)
      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
      expect(axios.defaults.headers.common['Authorization']).toBeUndefined()
    })
  })

  describe('Registration Process', () => {
    it('should return false when validation fails during login', async () => {
      // Instead of spying, test directly with invalid inputs
      const result = await authStore.login('invalid', 'short')
            
      // Verify validation failed
      expect(result).toBe(false)
      expect(authStore.errors.email).toBeTruthy()
      expect(authStore.errors.password).toBeTruthy()
    })

    it('should handle server errors during registration', async () => {
      // Mock server error
      const serverError = new Error('Server Error')
      serverError.response = { status: 500 }
      AuthenticationApi.prototype.registerAuthRegisterPost.mockRejectedValueOnce(serverError)
            
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            
      const result = await authStore.register('valid@example.com', 'password123')
            
      expect(result).toBe(false)
      expect(authStore.errors.general).toBe('Registration failed. Please try again.')
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })

  describe('Auth Store Initialization', () => {
    it('should do nothing when initializeAuth is called with no token', async () => {
      // Ensure no token exists
      localStorage.removeItem('token')
            
      // Spy on API call
      const getCurrentUserSpy = vi.spyOn(AuthenticationApi.prototype, 'getCurrentUser')
            
      await authStore.initializeAuth()
            
      // Verify API was not called
      expect(getCurrentUserSpy).not.toHaveBeenCalled()
    })
        
    it('should initialize auth state correctly with valid token', async () => {
      // Setup token in localStorage
      localStorage.setItem('token', 'valid-token')
            
      // Mock successful API response
      AuthenticationApi.prototype.getCurrentUser.mockResolvedValueOnce({
        data: { id: 123, email: 'user@example.com' }
      })
            
      // Re-create store to pick up token
      setActivePinia(createPinia())
      const store = useAuthStore()
            
      await store.initializeAuth()
            
      // Verify API was called
      expect(AuthenticationApi.prototype.getCurrentUser).toHaveBeenCalled()
            
      // Verify state is updated
      expect(store.user).toEqual({ id: 123, email: 'user@example.com' })
      expect(store.isAuthenticated).toBe(true)
      expect(axios.defaults.headers.common['Authorization']).toBe('Bearer valid-token')
    })
  })

  describe('Auth Status Check', () => {
    it('should verify token and update user data on successful check', async () => {
      // Setup token in localStorage
      localStorage.setItem('token', 'valid-token')
            
      // Mock successful API response
      AuthenticationApi.prototype.getCurrentUser.mockResolvedValueOnce({
        data: { id: 456, email: 'updated@example.com' }
      })
            
      // Re-create store to pick up token
      setActivePinia(createPinia())
      const store = useAuthStore()
            
      await store.checkAuth()
            
      // Verify API was called
      expect(AuthenticationApi.prototype.getCurrentUser).toHaveBeenCalled()
            
      // Verify user data was updated
      expect(store.user).toEqual({ id: 456, email: 'updated@example.com' })
    })

    it('should clear auth state when auth check fails', async () => {
      // Setup initial authenticated state
      localStorage.setItem('token', 'invalid-token')
      localStorage.setItem('user', JSON.stringify({ id: 1, email: 'test@example.com' }))
            
      // Set headers manually for testing
      axios.defaults.headers.common['Authorization'] = 'Bearer invalid-token'
            
      // Re-create store to pick up token from localStorage
      setActivePinia(createPinia())
      authStore = useAuthStore()
            
      // Mock API failure
      const authError = new Error('Unauthorized')
      authError.response = { status: 401 }
      AuthenticationApi.prototype.getCurrentUser.mockRejectedValueOnce(authError)
            
      // Mock console.error
      vi.spyOn(console, 'error').mockImplementation(() => {})
            
      // Before the check, store should be authenticated
      expect(authStore.isAuthenticated).toBe(true)
            
      // Call the method that should trigger logout
      await authStore.checkAuth()
            
      // After a failed check, auth state should be cleared
      expect(authStore.isAuthenticated).toBe(false)
      expect(authStore.token).toBeNull()
      expect(authStore.user).toBeNull()
      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
    })

       
    it('should do nothing when no token exists during auth check', async () => {
      // Ensure no token exists
      localStorage.removeItem('token')
            
      // Spy on API call
      const getCurrentUserSpy = vi.spyOn(AuthenticationApi.prototype, 'getCurrentUser')
            
      await authStore.checkAuth()
            
      // Verify API was not called
      expect(getCurrentUserSpy).not.toHaveBeenCalled()
    })
  })

  describe('Auth Form Validation', () => {
    it('should handle empty email and password validation', () => {
      // Test empty email
      expect(authStore.validateForm('', 'password123')).toBe(false)
      expect(authStore.errors.email).toBeTruthy()
            
      // Reset errors
      authStore.errors = {}
            
      // Test empty password
      expect(authStore.validateForm('test@example.com', '')).toBe(false)
      expect(authStore.errors.password).toBeTruthy()
            
      // Reset errors
      authStore.errors = {}
            
      // Test both empty
      expect(authStore.validateForm('', '')).toBe(false)
      expect(authStore.errors.email).toBeTruthy()
      expect(authStore.errors.password).toBeTruthy()
    })
      
    it('should validate email format', () => {
      // Test invalid email format
      expect(authStore.validateForm('notanemail', 'password123')).toBe(false)
      expect(authStore.errors.email).toBeTruthy()
    })
      
    it('should validate password length', () => {
      // Test short password
      expect(authStore.validateForm('test@example.com', '12345')).toBe(false)
      expect(authStore.errors.password).toBeTruthy()
    })
  })
      
  describe('Login Process', () => {
    it('should return false when validation fails during login', async () => {
      // Instead of spying, test directly with invalid inputs
      const result = await authStore.login('invalid', 'short')
            
      // Verify validation failed
      expect(result).toBe(false)
      expect(authStore.errors.email).toBeTruthy()
      expect(authStore.errors.password).toBeTruthy()
    })
        
    it('should handle authentication error with specific response status', async () => {
      // Mock login API to return authentication error
      const authError = new Error('Authentication failed')
      authError.response = { 
        status: 403,
        data: { detail: 'Account locked' }
      }
      AuthenticationApi.prototype.loginAuthLoginPost.mockRejectedValueOnce(authError)
            
      const result = await authStore.login('locked@example.com', 'password123')
            
      expect(result).toBe(false)
      expect(authStore.errors.general).toBeTruthy()
    })
  })
      
  describe('Registration Process', () => {
    // Replace this test too
    it('should return false when validation fails during registration', async () => {
      // Test directly with invalid inputs
      const result = await authStore.register('invalid', 'short')
            
      // Verify validation failed
      expect(result).toBe(false)
      expect(authStore.errors.email).toBeTruthy()
      expect(authStore.errors.password).toBeTruthy()
    })
        
    it('should handle successful registration', async () => {
      // Mock successful registration
      AuthenticationApi.prototype.registerAuthRegisterPost.mockResolvedValueOnce({
        data: { id: 123, email: 'new@example.com' }
      })
            
      const result = await authStore.register('new@example.com', 'password123')
            
      expect(result).toBe(true)
      expect(authStore.user).toEqual({ id: 123, email: 'new@example.com' })
    })
  })
      
  describe('Logout Process', () => {
    it('should handle successful logout', async () => {
      // Setup auth state
      localStorage.setItem('token', 'test-token')
      localStorage.setItem('user', JSON.stringify({ id: 1, email: 'test@example.com' }))
            
      // Setup headers
      axios.defaults.headers.common['Authorization'] = 'Bearer test-token'
            
      // Re-create store with token
      setActivePinia(createPinia())
      const store = useAuthStore()
            
      // Mock successful logout
      AuthenticationApi.prototype.logoutAuthLogoutPost.mockResolvedValueOnce({})
            
      await store.logout()
            
      // Check everything is cleared
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
      expect(axios.defaults.headers.common['Authorization']).toBeUndefined()
    })

    // Add this test to your Logout Process describe block
    it('should handle errors during logout API call', async () => {
      // Setup auth state with token
      localStorage.setItem('token', 'test-token')
      localStorage.setItem('user', JSON.stringify({ id: 1, email: 'test@example.com' }))
            
      // Setup headers
      axios.defaults.headers.common['Authorization'] = 'Bearer test-token'
            
      // Re-create store with token
      setActivePinia(createPinia())
      const store = useAuthStore()
            
      // Mock API to throw an error
      const logoutError = new Error('Network failure during logout')
      AuthenticationApi.prototype.logoutAuthLogoutPost.mockRejectedValueOnce(logoutError)
            
      // Spy on console.error to verify it's called
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            
      // Call logout
      await store.logout()
            
      // Verify console.error was called with our error
      expect(consoleErrorSpy).toHaveBeenCalledWith('Logout error:', logoutError)
            
      // Despite the API error, auth state should still be cleared (in finally block)
      expect(store.isAuthenticated).toBe(false)
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
      expect(axios.defaults.headers.common['Authorization']).toBeUndefined()
    })
        
    it('should do nothing when no token exists during logout', async () => {
      // Ensure no token exists
      localStorage.removeItem('token')
            
      // Re-create store (no token)
      setActivePinia(createPinia())
      const store = useAuthStore()
            
      // Spy on the API method
      const logoutSpy = vi.spyOn(AuthenticationApi.prototype, 'logoutAuthLogoutPost')
            
      await store.logout()
            
      // Verify API was not called
      expect(logoutSpy).not.toHaveBeenCalled()
    })
  })
      
  describe('Initialize Auth', () => {
    it('should handle API error during initialization', async () => {
      // Setup token
      localStorage.setItem('token', 'invalid-token')
            
      // Mock API failure
      const authError = new Error('Failed to get user')
      AuthenticationApi.prototype.getCurrentUser.mockRejectedValueOnce(authError)
            
      // Mock console.error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            
      // Re-create store with token
      setActivePinia(createPinia())
      const store = useAuthStore()
            
      await store.initializeAuth()
            
      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalled()
            
      // Auth state should be cleared
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
      expect(localStorage.getItem('token')).toBeNull()
    })
  })
      
  describe('Check Auth', () => {
    it('should handle network errors during auth check', async () => {
      // Setup token
      localStorage.setItem('token', 'test-token')
            
      // Re-create store with token
      setActivePinia(createPinia())
      const store = useAuthStore()
            
      // Mock network error (no response property)
      const networkError = new Error('Network Error')
      AuthenticationApi.prototype.getCurrentUser.mockRejectedValueOnce(networkError)
            
      // Mock console.error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            
      await store.checkAuth()
            
      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalled()
            
      // Auth state should be cleared after network error
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
    })
  })
})