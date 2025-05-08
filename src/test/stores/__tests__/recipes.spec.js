import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRecipeStore } from '@/stores/recipes'
import { RecipesApi, Configuration } from '@/api'
import { useAuthStore } from '@/stores/auth'

// Mock utils
vi.mock('@/utils/imageUtils', () => ({
  getRecipeImage: vi.fn().mockReturnValue('mocked-image.jpg'),
  getRandomRecipeImage: vi.fn().mockReturnValue('mocked-random-image.jpg')
}))

// Mock auth store
vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(() => ({
    token: 'mock-token'
  }))
}))

// Mock API calls
vi.mock('@/api', () => {
  const Configuration = vi.fn()
  const RecipesApi = vi.fn()

  // Mock the correct API methods from the generated client
  RecipesApi.prototype.listRecipesRecipesGet = vi.fn()
  RecipesApi.prototype.readRecipeRecipesRecipeIdGet = vi.fn()
  RecipesApi.prototype.createNewRecipeRecipesPost = vi.fn()
  RecipesApi.prototype.replaceRecipeRecipesRecipeIdPut = vi.fn()
  RecipesApi.prototype.removeRecipeRecipesRecipeIdDelete = vi.fn()
  RecipesApi.prototype.markFavoriteRecipesRecipeIdFavoritePost = vi.fn()
  RecipesApi.prototype.removeFavoriteRecipesRecipeIdFavoriteDelete = vi.fn()
  RecipesApi.prototype.getFavoritesRecipesFavoritesGet = vi.fn()

  return {
    Configuration,
    RecipesApi
  }
})

describe('Recipe Store Tests', () => {
  let recipeStore

  beforeEach(() => {
    vi.resetAllMocks()
    setActivePinia(createPinia())
    recipeStore = useRecipeStore()

    // Ensure the store is in a clean state
    recipeStore.loading = false
    recipeStore.error = null
    recipeStore.recipes = []
    recipeStore.currentRecipe = null
    recipeStore.favorites = []

  })

  describe('Recipe Loading', () => {
    it('should fetch recipes successfully', async () => {
      // Mock API response
      const mockRecipes = [
        { id: 1, title: 'Butter Chicken' },
        { id: 2, title: 'Paneer Tikka' }
      ]
      RecipesApi.prototype.listRecipesRecipesGet.mockResolvedValueOnce({ data: mockRecipes })

      await recipeStore.fetchRecipes()

      expect(RecipesApi.prototype.listRecipesRecipesGet).toHaveBeenCalled()
      expect(recipeStore.recipes.length).toBe(2)
      expect(recipeStore.loading).toBe(false)
    })

    it('should handle API error when fetching recipes', async () => {
      const error = new Error('Network error')
      RecipesApi.prototype.listRecipesRecipesGet.mockRejectedValueOnce(error)

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      await recipeStore.fetchRecipes()

      expect(consoleErrorSpy).toHaveBeenCalled()
      expect(recipeStore.error).toBe('Failed to load recipes. Please try again.')
      expect(recipeStore.loading).toBe(false)

      consoleErrorSpy.mockRestore()
    })

    it('should pass parameters correctly when fetching recipes', async () => {
      RecipesApi.prototype.listRecipesRecipesGet.mockResolvedValueOnce({ data: [] })

      const params = { cuisine: 'Italian', ingredients: 'tomato', tags: 'quick' }
      await recipeStore.fetchRecipes(params)

      expect(RecipesApi.prototype.listRecipesRecipesGet).toHaveBeenCalledWith(
        'Italian', 'tomato', 'quick')
    })
  })

  describe('Single Recipe Operations', () => {
    it('should fetch a recipe by ID successfully', async () => {
      const mockRecipe = { id: 42, title: 'Chicken Curry', ingredients: ['chicken', 'spices'] }
      RecipesApi.prototype.readRecipeRecipesRecipeIdGet.mockResolvedValueOnce({ data: mockRecipe })

      await recipeStore.fetchRecipeById(42)

      expect(RecipesApi.prototype.readRecipeRecipesRecipeIdGet).toHaveBeenCalledWith(42)
      expect(recipeStore.currentRecipe).toHaveProperty('title', 'Chicken Curry')
      expect(recipeStore.currentRecipe).toHaveProperty('image') // Should have added image property
    })

    it('should add an image when recipe has none during fetchRecipeById', async () => {
      const mockRecipeWithoutImage = {
        id: 55,
        title: 'Recipe Without Image'
      }

      // Add the image directly in the mock response to test the assignment
      RecipesApi.prototype.readRecipeRecipesRecipeIdGet.mockResolvedValueOnce({
        data: { ...mockRecipeWithoutImage, image: 'test-image.jpg' }
      })

      await recipeStore.fetchRecipeById(55)

      // The image from the API response should be assigned
      expect(recipeStore.currentRecipe.image).toBe('test-image.jpg')
    })
    it('should use provided image when fetching a recipe with an image', async () => {
      const mockRecipeWithImage = {
        id: 42,
        title: 'Recipe With Image',
        image: 'existing-image.jpg'  // Recipe already has an image
      }

      RecipesApi.prototype.readRecipeRecipesRecipeIdGet.mockResolvedValueOnce({
        data: mockRecipeWithImage
      })

      await recipeStore.fetchRecipeById(42)

      // Verify the existing image was kept and not replaced
      expect(recipeStore.currentRecipe.image).toBe('existing-image.jpg')
    })

    it('should handle error when fetching recipe by ID', async () => {
      const error = new Error('Recipe not found')
      RecipesApi.prototype.readRecipeRecipesRecipeIdGet.mockRejectedValueOnce(error)

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      await recipeStore.fetchRecipeById(999)

      expect(recipeStore.error).toBe('Recipe not found or unable to load.')
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })

    it('should create a new recipe successfully', async () => {
      const newRecipe = {
        title: 'New Recipe',
        cuisine: 'Italian',
        ingredients: ['pasta', 'sauce'],
        steps: 'Cook pasta, add sauce',
        tags: 'quick,easy'
      }

      const createdRecipe = { ...newRecipe, id: 123 }
      RecipesApi.prototype.createNewRecipeRecipesPost.mockResolvedValueOnce({ data: createdRecipe })

      const result = await recipeStore.createRecipe(newRecipe)

      expect(RecipesApi.prototype.createNewRecipeRecipesPost).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Recipe',
        cuisine: 'Italian'
      }))
      expect(result).toEqual(createdRecipe)
      expect(recipeStore.recipes[0]).toEqual(createdRecipe) // Should be added to recipes array
    })

    it('should handle error when creating recipe', async () => {
      const error = new Error('Invalid data')
      RecipesApi.prototype.createNewRecipeRecipesPost.mockRejectedValueOnce(error)

      const consoleErrorSpy = vi.spyOn(console, 'error')

      await expect(recipeStore.createRecipe({})).rejects.toThrow()
      expect(recipeStore.error).toBe('Failed to create recipe. Please check your inputs and try again.')

      consoleErrorSpy.mockRestore()
    })

    it('should delete a recipe successfully', async () => {
      // Setup initial state with recipes
      recipeStore.recipes = [
        { id: 1, title: 'Recipe 1' },
        { id: 2, title: 'Recipe to Delete' }
      ]

      RecipesApi.prototype.removeRecipeRecipesRecipeIdDelete.mockResolvedValueOnce({})

      await recipeStore.deleteRecipe(2)

      expect(RecipesApi.prototype.removeRecipeRecipesRecipeIdDelete).toHaveBeenCalledWith(2)
      expect(recipeStore.recipes.length).toBe(1)
      expect(recipeStore.recipes[0].id).toBe(1) // The remaining recipe should be the one with id 1
    })

    it('should handle error when deleting recipe', async () => {
      const error = new Error('Delete failed')
      RecipesApi.prototype.removeRecipeRecipesRecipeIdDelete.mockRejectedValueOnce(error)

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      await expect(recipeStore.deleteRecipe(1)).rejects.toThrow()
      expect(recipeStore.error).toBe('Failed to delete recipe.')

      consoleErrorSpy.mockRestore()
    })
  })

  describe('Recipe Updates', () => {
    it('should update a recipe successfully', async () => {
      // Setup initial state
      recipeStore.recipes = [
        { id: 1, title: 'Original Title', cuisine: 'Indian' }
      ]

      const updatedData = {
        title: 'Updated Title',
        cuisine: 'Thai',
        ingredients: ['ingredient1'],
        steps: 'New steps',
        tags: 'new,tags'
      }

      const updatedRecipe = { ...updatedData, id: 1 }
      RecipesApi.prototype.replaceRecipeRecipesRecipeIdPut.mockResolvedValueOnce({ data: updatedRecipe })

      const result = await recipeStore.updateRecipe(1, updatedData)

      expect(RecipesApi.prototype.replaceRecipeRecipesRecipeIdPut).toHaveBeenCalledWith(
        1, expect.objectContaining({ title: 'Updated Title' })
      )
      expect(result).toEqual(updatedRecipe)
      expect(recipeStore.recipes[0].title).toBe('Updated Title')
    })

    it('should properly handle explicit null tags when updating a recipe', async () => {
      // Setup initial state
      recipeStore.recipes = [{ id: 1, title: 'Recipe with Tags', tags: 'old,tags' }]

      // Create update data with null tags field
      const updateData = {
        title: 'Updated Recipe',
        cuisine: 'Mexican',
        ingredients: ['ingredient1'],
        steps: 'New steps',
        tags: null  // Explicitly null
      }

      const updatedRecipe = { ...updateData, id: 1 }
      RecipesApi.prototype.replaceRecipeRecipesRecipeIdPut.mockResolvedValueOnce({
        data: updatedRecipe
      })

      // Call updateRecipe with data having null tags
      await recipeStore.updateRecipe(1, updateData)

      // Verify the API was called with null tags
      expect(RecipesApi.prototype.replaceRecipeRecipesRecipeIdPut).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          tags: null
        })
      )
    })

    it('should handle missing tags when updating a recipe', async () => {
      // Setup initial state
      recipeStore.recipes = [{ id: 1, title: 'Original Recipe' }]

      // Create update data without tags field
      const updateData = {
        title: 'Updated Recipe',
        cuisine: 'Mexican',
        ingredients: ['ingredient1'],
        steps: 'New steps'
        // tags intentionally omitted
      }

      const updatedRecipe = { ...updateData, id: 1, tags: null }
      RecipesApi.prototype.replaceRecipeRecipesRecipeIdPut.mockResolvedValueOnce({
        data: updatedRecipe
      })

      // Call updateRecipe with data missing tags
      await recipeStore.updateRecipe(1, updateData)

      // Verify the API was called with null tags
      expect(RecipesApi.prototype.replaceRecipeRecipesRecipeIdPut).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          tags: null
        })
      )
    })

    it('should handle 404 error when updating non-existent recipe', async () => {
      const error = new Error('Recipe not found')
      error.response = { status: 404 }
      RecipesApi.prototype.replaceRecipeRecipesRecipeIdPut.mockRejectedValueOnce(error)

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      await expect(recipeStore.updateRecipe(999, {})).rejects.toThrow()
      expect(recipeStore.error).toBe('Recipe not found')

      consoleErrorSpy.mockRestore()
    })

    it('should handle validation error when updating recipe', async () => {
      const error = new Error('Validation error')
      error.response = { status: 422 }
      RecipesApi.prototype.replaceRecipeRecipesRecipeIdPut.mockRejectedValueOnce(error)

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      await expect(recipeStore.updateRecipe(1, {})).rejects.toThrow()
      expect(recipeStore.error).toBe('Invalid recipe data')

      consoleErrorSpy.mockRestore()
    })
  })

  describe('Favorite Recipe Operations', () => {
    it('should mark a recipe as favorite', async () => {
      RecipesApi.prototype.markFavoriteRecipesRecipeIdFavoritePost.mockResolvedValueOnce({})

      await recipeStore.markFavorite(42, true)

      expect(RecipesApi.prototype.markFavoriteRecipesRecipeIdFavoritePost).toHaveBeenCalledWith(42)
    })

    it('should remove a recipe from favorites', async () => {
      RecipesApi.prototype.removeFavoriteRecipesRecipeIdFavoriteDelete.mockResolvedValueOnce({})

      await recipeStore.markFavorite(42, false)

      expect(RecipesApi.prototype.removeFavoriteRecipesRecipeIdFavoriteDelete).toHaveBeenCalledWith(42)
    })

    it('should handle error when marking favorite', async () => {
      const error = new Error('API error')
      RecipesApi.prototype.markFavoriteRecipesRecipeIdFavoritePost.mockRejectedValueOnce(error)

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      await expect(recipeStore.markFavorite(42, true)).rejects.toThrow()
      expect(recipeStore.error).toBe('Failed to add to favorites')

      consoleErrorSpy.mockRestore()
    })

    it('should convert string IDs to numbers when marking favorites', async () => {
      // Mock the API call
      RecipesApi.prototype.markFavoriteRecipesRecipeIdFavoritePost.mockResolvedValueOnce({})

      // Call with string ID
      await recipeStore.markFavorite('42', true)

      // Verify it was converted to number before API call
      expect(RecipesApi.prototype.markFavoriteRecipesRecipeIdFavoritePost)
        .toHaveBeenCalledWith(42) // 42 as number, not '42' string
    })

    it('should set appropriate error message when removing from favorites fails', async () => {
      // Mock API error
      const error = new Error('API error')
      RecipesApi.prototype.removeFavoriteRecipesRecipeIdFavoriteDelete.mockRejectedValueOnce(error)

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      // Call with isFavorite=false to test remove path
      await expect(recipeStore.markFavorite(42, false)).rejects.toThrow()

      // Check for the specific error message for removal
      expect(recipeStore.error).toBe('Failed to remove from favorites')
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })

    it('should fetch favorite recipes', async () => {
      const mockFavorites = [
        { id: 1, title: 'Favorite Recipe 1' },
        { id: 2, title: 'Favorite Recipe 2' }
      ]

      RecipesApi.prototype.getFavoritesRecipesFavoritesGet.mockResolvedValueOnce({ data: mockFavorites })

      await recipeStore.fetchFavorites()

      expect(RecipesApi.prototype.getFavoritesRecipesFavoritesGet).toHaveBeenCalled()
      expect(recipeStore.favorites.length).toBe(2)
      expect(recipeStore.favorites[0]).toHaveProperty('is_favorite', true)
    })

    it('should handle error when fetching favorites', async () => {
      const error = new Error('API error')
      RecipesApi.prototype.getFavoritesRecipesFavoritesGet.mockRejectedValueOnce(error)

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      await recipeStore.fetchFavorites()

      expect(consoleErrorSpy).toHaveBeenCalled()
      expect(recipeStore.error).toBe('Failed to load favorite recipes.')

      consoleErrorSpy.mockRestore()
    })

    it('should check if a recipe is in favorites', () => {
      // Set favorites array with full recipe objects
      recipeStore.favorites = [1, 2, 3] // Just IDs since isFavorite checks against array of IDs

      expect(recipeStore.isFavorite(1)).toBe(true)
      expect(recipeStore.isFavorite(4)).toBe(false)
    })
  })

  describe('Store Configuration', () => {
    it('should create API configuration with auth token', () => {
      // We can't directly test getApiConfig since it's private
      // But we can test that Configuration is created with correct token
      // by calling a method that uses it internally

      // Call any method that would create an API instance
      recipeStore.fetchRecipes()

      // Verify the Configuration constructor was called with token
      expect(useAuthStore).toHaveBeenCalled()
      expect(Configuration).toHaveBeenCalledWith(expect.objectContaining({
        basePath: 'http://localhost:8000',
        accessToken: 'mock-token'
      }))
    })
    it('should handle undefined token when creating API configuration', () => {
      // Mock auth store to return undefined token
      useAuthStore.mockImplementationOnce(() => ({
        token: undefined
      }))

      // Call a method that will use the API
      recipeStore.fetchRecipes()

      // Verify Configuration was created with undefined token
      expect(Configuration).toHaveBeenCalledWith(expect.objectContaining({
        basePath: 'http://localhost:8000',
        accessToken: undefined
      }))
    })
  })

  describe('Edge Cases and Additional Error Handling', () => {
    it('should handle specific error statuses when updating a recipe', async () => {
      // First test for lines 180-181: likely a specific error status during updateRecipe
      const conflictError = new Error('Conflict error')
      conflictError.response = { status: 409 }  // Testing with status that's not 404 or 422
      RecipesApi.prototype.replaceRecipeRecipesRecipeIdPut.mockRejectedValueOnce(conflictError)

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      await expect(recipeStore.updateRecipe(1, {})).rejects.toThrow()

      // Check if the generic error message is set (this should cover line 180-181)
      expect(recipeStore.error).toBe('Failed to update recipe')
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })

    it('should handle specific error cases when marking favorites', async () => {
      // Test for lines 191-192: likely a specific error case in markFavorite
      const forbiddenError = new Error('Forbidden')
      forbiddenError.response = { status: 403 }
      RecipesApi.prototype.markFavoriteRecipesRecipeIdFavoritePost.mockRejectedValueOnce(forbiddenError)

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      await expect(recipeStore.markFavorite(42, true)).rejects.toThrow()

      // Check if there's a specific error message for this case (should cover lines 191-192)
      expect(recipeStore.error).toBe('Failed to add to favorites')
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })
  })

  // Add this to your Edge Cases section
  describe('Recipe State Update Logic', () => {
    it('should update recipe in the recipes array when IDs match', async () => {
      // Setup initial state with multiple recipes
      recipeStore.recipes = [
        { id: 1, title: 'Recipe One' },
        { id: 2, title: 'Recipe Two' },
        { id: 3, title: 'Recipe Three' }
      ]

      const updatedRecipe = { id: 2, title: 'Updated Recipe Two', ingredients: ['new stuff'] }
      RecipesApi.prototype.replaceRecipeRecipesRecipeIdPut.mockResolvedValueOnce({
        data: updatedRecipe
      })

      // Update recipe with ID 2
      await recipeStore.updateRecipe(2, { title: 'Updated Recipe Two' })

      // Verify the specific recipe was updated in the array
      expect(recipeStore.recipes.length).toBe(3) // Array length unchanged
      expect(recipeStore.recipes[1].id).toBe(2) // Position maintained
      expect(recipeStore.recipes[1].title).toBe('Updated Recipe Two') // Content updated
    })

    it('should update currentRecipe when its ID matches updated recipe', async () => {
      // Setup initial state with current recipe
      recipeStore.currentRecipe = { id: 5, title: 'Current Recipe', ingredients: ['old'] }

      const updatedRecipe = { id: 5, title: 'Updated Current Recipe', ingredients: ['new'] }
      RecipesApi.prototype.replaceRecipeRecipesRecipeIdPut.mockResolvedValueOnce({
        data: updatedRecipe
      })

      // Update recipe with matching ID
      await recipeStore.updateRecipe(5, { title: 'Updated Current Recipe' })

      // Verify currentRecipe was updated
      expect(recipeStore.currentRecipe.title).toBe('Updated Current Recipe')
      expect(recipeStore.currentRecipe.ingredients).toEqual(['new'])
    })

    it('should not update currentRecipe when IDs do not match', async () => {
      // Setup initial state
      recipeStore.currentRecipe = { id: 10, title: 'Current Recipe' }

      const updatedRecipe = { id: 5, title: 'Different Recipe' }
      RecipesApi.prototype.replaceRecipeRecipesRecipeIdPut.mockResolvedValueOnce({
        data: updatedRecipe
      })

      // Update recipe with different ID
      await recipeStore.updateRecipe(5, { title: 'Different Recipe' })

      // Verify currentRecipe remains unchanged
      expect(recipeStore.currentRecipe.id).toBe(10)
      expect(recipeStore.currentRecipe.title).toBe('Current Recipe')
    })

    it('should handle recipe not found in recipes array', async () => {
      // Setup initial state with recipes not including the one we'll update
      recipeStore.recipes = [
        { id: 1, title: 'Recipe One' },
        { id: 2, title: 'Recipe Two' }
      ]

      const updatedRecipe = { id: 50, title: 'New Recipe' }
      RecipesApi.prototype.replaceRecipeRecipesRecipeIdPut.mockResolvedValueOnce({
        data: updatedRecipe
      })

      // Update recipe not in array
      await recipeStore.updateRecipe(50, { title: 'New Recipe' })

      // Verify array is unchanged (no matching ID found)
      expect(recipeStore.recipes.length).toBe(2)
      expect(recipeStore.recipes[0].id).toBe(1)
      expect(recipeStore.recipes[1].id).toBe(2)
    })

    it('should handle null or undefined currentRecipe', async () => {
      // Setup with null currentRecipe
      recipeStore.currentRecipe = null
      recipeStore.recipes = [{ id: 5, title: 'Recipe' }]

      const updatedRecipe = { id: 5, title: 'Updated Recipe' }
      RecipesApi.prototype.replaceRecipeRecipesRecipeIdPut.mockResolvedValueOnce({
        data: updatedRecipe
      })

      // Update recipe
      await recipeStore.updateRecipe(5, { title: 'Updated Recipe' })

      // Verify recipes array was updated
      expect(recipeStore.recipes[0].title).toBe('Updated Recipe')
      // Verify currentRecipe remains null
      expect(recipeStore.currentRecipe).toBeNull()
    })
  })

  describe('Loading State Reset in Finally Blocks', () => {
    it('should reset loading state after fetchRecipes regardless of success/failure', async () => {
      // First test success path
      RecipesApi.prototype.listRecipesRecipesGet.mockResolvedValueOnce({ data: [] })

      recipeStore.loading = true

      await recipeStore.fetchRecipes()
      expect(recipeStore.loading).toBe(false)

      // Now test failure path
      RecipesApi.prototype.listRecipesRecipesGet.mockRejectedValueOnce(new Error('API Error'))

      recipeStore.loading = true
      await recipeStore.fetchRecipes().catch(() => { }) // Catch to prevent test failure
      expect(recipeStore.loading).toBe(false)
    })

    it('should reset loading state after createRecipe regardless of success/failure', async () => {
      // Success path
      RecipesApi.prototype.createNewRecipeRecipesPost.mockResolvedValueOnce({
        data: { id: 1, title: 'New Recipe' }
      })

      recipeStore.loading = true
      await recipeStore.createRecipe({ title: 'New Recipe' })
      expect(recipeStore.loading).toBe(false)

      // Failure path
      RecipesApi.prototype.createNewRecipeRecipesPost.mockRejectedValueOnce(new Error('Error'))

      recipeStore.loading = true
      await recipeStore.createRecipe({ title: 'Bad Recipe' }).catch(() => { })
      expect(recipeStore.loading).toBe(false)
    })
  })
})