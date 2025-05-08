import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Configuration, RecipesApi } from '@/api'
import { useAuthStore } from './auth'
import { getRecipeImage, getRandomRecipeImage, DEFAULT_RECIPE_IMAGE } from '../utils/imageUtils'

const API_BASE_URL = 'http://localhost:8000'

export const useRecipeStore = defineStore('recipe', () => {
  const recipes = ref([])
  const currentRecipe = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const trendingRecipes = ref([])
  const favorites = ref([])

  const getApiConfig = () => {
    const authStore = useAuthStore()
    return new Configuration({
      basePath: API_BASE_URL,
      accessToken: authStore.token || undefined
    })
  }

  const fetchRecipes = async (params = {}) => {
    try {
      loading.value = true
      error.value = null
      const recipesApi = new RecipesApi(getApiConfig())
      const response = await recipesApi.listRecipesRecipesGet(
        params.cuisine,
        params.ingredients,
        params.tags
      )
      recipes.value = response.data.map(recipe => ({
        ...recipe,
        image: recipe.image || getRecipeImage(recipe.id)
      }))
    } catch (err) {
      error.value = 'Failed to load recipes. Please try again.'
      console.error('Error fetching recipes:', err)
    } finally {
      loading.value = false
    }
  }

  const createRecipe = async (recipeData) => {
    try {
      loading.value = true
      error.value = null
      const recipesApi = new RecipesApi(getApiConfig())
      const response = await recipesApi.createNewRecipeRecipesPost({
        title: recipeData.title,
        cuisine: recipeData.cuisine || 'Other',
        ingredients: recipeData.ingredients,
        steps: recipeData.steps,
        tags: recipeData.tags
      })
      recipes.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = 'Failed to create recipe. Please check your inputs and try again.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchRecipeById = async (id) => {
    try {
      loading.value = true
      error.value = null
      const recipesApi = new RecipesApi(getApiConfig())
      const response = await recipesApi.readRecipeRecipesRecipeIdGet(id)
      currentRecipe.value = {
        ...response.data,
        image: response.data.image || getRecipeImage(response.data.id)
      }
    } catch (err) {
      error.value = 'Recipe not found or unable to load.'
      console.error('Error fetching recipe:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchTrendingRecipes = async () => {
    try {
      const recipesApi = new RecipesApi(getApiConfig())
      const response = await recipesApi.listRecipesRecipesGet(null, null, null, 1, 3)
      trendingRecipes.value = response.data.map(recipe => ({
        ...recipe,
        image: recipe.image || getRandomRecipeImage()
      }))
    } catch (err) {
      console.error('Error fetching trending recipes:', err)
    }
  }

  const deleteRecipe = async (id) => {
    try {
      loading.value = true
      error.value = null
      const recipesApi = new RecipesApi(getApiConfig())
      await recipesApi.removeRecipeRecipesRecipeIdDelete(id)
      recipes.value = recipes.value.filter(recipe => recipe.id !== id)
    } catch (err) {
      error.value = 'Failed to delete recipe.'
      console.error('Error deleting recipe:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const markFavorite = async (recipeId, isFavorite) => {
    try {
      loading.value = true
      error.value = null
      const recipesApi = new RecipesApi(getApiConfig())
      
      // Ensure recipeId is a number
      const id = typeof recipeId === 'string' ? parseInt(recipeId, 10) : recipeId

      // Use the correct API method
      if (isFavorite) {
        await recipesApi.markFavoriteRecipesRecipeIdFavoritePost(id)
      } else {
        await recipesApi.removeFavoriteRecipesRecipeIdFavoriteDelete(id)
      }

    } catch (err) {
      error.value = isFavorite 
        ? 'Failed to add to favorites' 
        : 'Failed to remove from favorites'
      console.error('Error updating favorite status:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchFavorites = async () => {
    try {
      loading.value = true
      error.value = null
      const recipesApi = new RecipesApi(getApiConfig())
      // Check the actual API endpoint name from your OpenAPI spec
      const response = await recipesApi.getFavoritesRecipesFavoritesGet()
      favorites.value = response.data.map(recipe => ({
        ...recipe,
        image: recipe.image || getRandomRecipeImage(),
        is_favorite: true
      }))
    } catch (err) {
      error.value = 'Failed to load favorite recipes.'
      console.error('Error fetching favorites:', err)
    } finally {
      loading.value = false
    }
  }

  const isFavorite = (recipeId) => {
    return favorites.value.includes(recipeId)
  }

  const updateRecipe = async (id, recipeData) => {
    try {
      loading.value = true
      error.value = null
      
      // Ensure recipeData matches RecipeCreate schema
      const recipeCreate = {
        title: recipeData.title,
        cuisine: recipeData.cuisine,
        ingredients: recipeData.ingredients,
        steps: recipeData.steps,
        tags: recipeData.tags || null // Optional field
      }

      // Use the generated API client
      const recipesApi = new RecipesApi(getApiConfig())
      const { data } = await recipesApi.replaceRecipeRecipesRecipeIdPut(
        id,
        recipeCreate
      )
      
      // Update local state with RecipeOut data
      const index = recipes.value.findIndex(r => r.id === id)
      if (index !== -1) {
        recipes.value[index] = data
      }
      if (currentRecipe.value?.id === id) {
        currentRecipe.value = data
      }
      
      return data
    } catch (err) {
      // Handle specific error cases
      if (err.response?.status === 404) {
        error.value = 'Recipe not found'
      } else if (err.response?.status === 422) {
        error.value = 'Invalid recipe data'
      } else {
        error.value = 'Failed to update recipe'
      }
      console.error('Error updating recipe:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    recipes,
    currentRecipe,
    loading,
    error,
    trendingRecipes,
    fetchRecipes,
    createRecipe,
    fetchRecipeById,
    fetchTrendingRecipes,
    deleteRecipe,
    favorites,
    markFavorite,
    fetchFavorites,
    isFavorite,
    updateRecipe
  }
})