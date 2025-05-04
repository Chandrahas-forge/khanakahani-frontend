import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Configuration, RecipesApi } from '@/api'
import { useAuthStore } from './auth'

const API_BASE_URL = 'http://localhost:8000'

export const useRecipeStore = defineStore('recipe', () => {
  const recipes = ref([])
  const currentRecipe = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const trendingRecipes = ref([])

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
        image: recipe.image || 'https://via.placeholder.com/300?text=No+Image'
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
        image: response.data.image || 'https://via.placeholder.com/300?text=No+Image'
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
        image: recipe.image || 'https://via.placeholder.com/300?text=No+Image'
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
    deleteRecipe
  }
})