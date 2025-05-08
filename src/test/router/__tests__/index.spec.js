import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import router from '@/router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Recipes from '@/views/Recipes.vue'
import CreateRecipe from '@/views/CreateRecipe.vue'
import EditRecipe from '@/views/EditRecipe.vue'
import { useAuthStore } from '@/stores/auth'

// Mock async components
vi.mock('@/views/RecipeDetail.vue', () => ({
  default: { name: 'RecipeDetail' }
}))
vi.mock('@/views/MyRecipes.vue', () => ({
  default: { name: 'MyRecipes' }
}))

describe('Router', () => {
  let testRouter, authStore

  beforeEach(() => {
    // Setup fresh Pinia
    setActivePinia(createPinia())
    authStore = useAuthStore()

    // Create test router instance using our actual routes
    testRouter = createRouter({
      history: createWebHistory(),
      routes: router.options.routes
    })

    // Navigation guard: if route requires auth and user is not authenticated, redirect to '/login'
    testRouter.beforeEach((to, from, next) => {
      if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login')
      } else {
        next()
      }
    })
  })

  it('contains home route', () => {
    const route = testRouter.options.routes.find(r => r.path === '/')
    expect(route).toBeDefined()
    expect(route.name).toBe('home')
    expect(route.component).toBe(Home)
  })

  it('contains browse route', () => {
    const route = testRouter.options.routes.find(r => r.path === '/browse')
    expect(route).toBeDefined()
    expect(route.name).toBe('browse')
    expect(route.component).toBe(Recipes)
  })

  it('redirects /recipes to /browse', () => {
    const route = testRouter.options.routes.find(r => r.path === '/recipes')
    expect(route).toBeDefined()
    expect(route.redirect).toBe('/browse')
  })

  it('handles recipe detail route with dynamic id', () => {
    const route = testRouter.options.routes.find(r => r.path === '/recipes/:id')
    expect(route).toBeDefined()
    expect(route.name).toBe('RecipeDetail')
    expect(route.props).toBe(true)
  })

  it('contains protected create recipe route', () => {
    const route = testRouter.options.routes.find(r => r.path === '/create-recipe')
    expect(route).toBeDefined()
    expect(route.name).toBe('create-recipe')
    expect(route.component).toBe(CreateRecipe)
  })

  it('contains protected edit recipe route', () => {
    const route = testRouter.options.routes.find(r => r.path === '/recipes/:id/edit')
    expect(route).toBeDefined()
    expect(route.name).toBe('edit-recipe')
    expect(route.component).toBe(EditRecipe)
    expect(route.meta.requiresAuth).toBe(true)
  })
  it('contains login route', () => {
    const route = testRouter.options.routes.find(r => r.path === '/login')
    expect(route).toBeDefined()
    expect(route.name).toBe('login')
    expect(route.component).toBe(Login)
  })

  it('contains protected my recipes route', () => {
    const route = testRouter.options.routes.find(r => r.path === '/my-recipes')
    expect(route).toBeDefined()
    expect(route.name).toBe('MyRecipes')
    expect(route.meta.requiresAuth).toBe(true)
  })

  it('redirects old recipe paths to new format', async () => {
    const route = testRouter.options.routes.find(r => r.path === '/recipe/:id')
    expect(route).toBeDefined()
    expect(typeof route.redirect).toBe('function')
    
    const redirectResult = route.redirect({ params: { id: '123' } })
    expect(redirectResult).toEqual({ path: '/recipes/123' })
  })

  it('imports dynamic components correctly', async () => {
    // Get the route definitions that use dynamic imports
    const recipeDetailRoute = testRouter.options.routes.find(r => r.path === '/recipes/:id')
    const myRecipesRoute = testRouter.options.routes.find(r => r.path === '/my-recipes')
    
    // Verify they're functions (dynamic imports return a function)
    expect(typeof recipeDetailRoute.component).toBe('function')
    expect(typeof myRecipesRoute.component).toBe('function')
    
    // Try to resolve them - this will trigger the dynamic import
    // We don't need to await the result since our mocks handle it
    const recipeDetailPromise = recipeDetailRoute.component()
    const myRecipesPromise = myRecipesRoute.component()
    
    // Verify they return promises (which is what dynamic imports do)
    expect(recipeDetailPromise instanceof Promise).toBe(true)
    expect(myRecipesPromise instanceof Promise).toBe(true)
  })

  it('redirects old recipe paths to new format', async () => {
    const route = testRouter.options.routes.find(r => r.path === '/recipe/:id')
    expect(route).toBeDefined()
    
    // Store the redirect function and verify it's a function
    const redirectFn = route.redirect
    expect(typeof redirectFn).toBe('function')
    
    // Test with multiple IDs to ensure coverage
    const testIds = ['123', 'abc', '456']
    
    testIds.forEach(id => {
      const redirectResult = redirectFn({ params: { id } })
      expect(redirectResult).toEqual({ path: `/recipes/${id}` })
    })
    
    // Also test actual navigation with the router
    await testRouter.push('/recipe/789')
    expect(testRouter.currentRoute.value.path).toBe('/recipes/789')
  })



  describe('Navigation Guards', () => {
    beforeEach(async () => {
      await testRouter.push('/') // reset route to home
    })

    it('redirects to login for protected routes when not authenticated', async () => {
      authStore.$patch({ isAuthenticated: false })
      await nextTick()
      await testRouter.push('/my-recipes')
      expect(testRouter.currentRoute.value.path).toBe('/login')
    })

    it('allows access to protected routes when authenticated', async () => {
      // Use a mock computed property for isAuthenticated instead of the reactive one
      vi.spyOn(authStore, 'isAuthenticated', 'get').mockReturnValue(true)
      
      // Reset the router (alternative to creating a new one)
      await testRouter.push('/')
      await testRouter.isReady()
      
      // Now navigate to the protected route
      await testRouter.push('/my-recipes')
      
      // Verify we ended up at the protected route
      expect(testRouter.currentRoute.value.path).toBe('/my-recipes')
      
      // Clean up the spy
      vi.restoreAllMocks()
    })

    it('handles navigation guards for protected routes', async () => {
      authStore.$patch({ isAuthenticated: false })
      const routeDef = testRouter.options.routes.find(r => r.path === '/my-recipes')
      expect(routeDef.meta.requiresAuth).toBe(true)
      
      await testRouter.push('/my-recipes')
      expect(testRouter.currentRoute.value.path).toBe('/login')
    })

    it('handles navigation errors', async () => {
      // Import NavigationFailureType at the top of your file if not already imported
      // import { createRouter, createWebHistory, isNavigationFailure, NavigationFailureType } from 'vue-router'
      
      // Add a non-existent route deliberately to cause a failure
      const removeGuard = testRouter.beforeEach((to, from, next) => {
        if (to.path === '/error') {
          next(false)
        } else {
          next()
        }
      })
      
      // Attempt the navigation and capture the result
      const navigationResult = await testRouter.push('/error').catch(e => e)
      
      // Check if it was aborted (which is a kind of navigation failure)
      expect(navigationResult).toBeDefined()
      expect(navigationResult).not.toBeUndefined()
      expect(navigationResult.toString().includes('Navigation aborted')).toBe(true)
      
      // Clean up
      removeGuard()
    })
  })
  
  describe('Router Configuration', () => {
    it('uses correct history mode', () => {
      expect(testRouter.options.history).toBeInstanceOf(createWebHistory().constructor)
    })

    it('has all required routes configured', () => {
      const requiredPaths = ['/', '/browse', '/recipes', '/login', '/my-recipes']
      requiredPaths.forEach(path => {
        const route = testRouter.options.routes.find(r => r.path === path)
        expect(route).toBeDefined()
      })
    })
  })
})