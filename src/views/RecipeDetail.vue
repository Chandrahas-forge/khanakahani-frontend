<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p class="mt-4 text-gray-500">Loading recipe...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12 text-red-500">
      {{ error }}
    </div>

    <!-- Recipe Content -->
    <div v-else-if="recipe" class="max-w-4xl mx-auto">
      <!-- Add a success message for actions -->
      <div v-if="actionMessage" class="mb-4 p-4 bg-green-100 text-green-700 rounded">
        {{ actionMessage }}
      </div>

      <!-- Recipe Header -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-4xl font-bold text-gray-900">{{ recipe.title }}</h1>
          
          <!-- Move action buttons here -->
          <div class="flex gap-2">
            <template v-if="isUserRecipe">
              <router-link 
                :to="`/recipes/${recipe.id}/edit`"
                class="btn bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </router-link>
              
              <button 
                @click="handleDelete"
                class="btn bg-white hover:bg-red-50 text-red-600 border border-red-600"
              >
                <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path 
                    stroke="currentColor" 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    class="text-red-600"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                  />
                </svg>
                Delete
              </button>
            </template>
          </div>
        </div>
        
        <!-- Rating and date remain in place -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="flex items-center">
              <template v-for="n in 5" :key="n">
                <svg
                  class="h-6 w-6"
                  :class="n <= recipe.rating ? 'text-yellow-400' : 'text-gray-300'"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </template>
            </div>
            <span class="ml-2 text-gray-500">{{ recipe.date }}</span>
          </div>
        </div>
      </div>

      <!-- Recipe Image -->
      <div class="mb-8">
        <img
          :src="recipe.image || DEFAULT_RECIPE_IMAGE"
          :alt="recipe.title"
          class="w-full h-96 object-cover rounded-lg shadow-lg"
        >
      </div>

      <!-- Recipe Cuisine -->
      <div class="mb-4">
        <span class="inline-block bg-primary-100 text-primary-800 rounded-full px-3 py-1 text-sm">
          {{ recipe.cuisine }}
        </span>
      </div>

      <!-- Recipe Ingredients -->
      <div class="mb-4">
        <h2 class="text-xl font-semibold mb-2">Ingredients</h2>
        <ul class="list-disc pl-6">
          <li v-for="item in recipe.ingredients" :key="item">{{ item }}</li>
        </ul>
      </div>

      <!-- Recipe Preparation Steps -->
      <div class="mb-4">
        <h2 class="text-xl font-semibold mb-2">Preparation Steps</h2>
        <p class="whitespace-pre-line text-gray-700">{{ recipe.steps }}</p>
      </div>

      <!-- Recipe Tags -->
      <div class="mb-4" v-if="recipe.tags">
        <h2 class="text-xl font-semibold mb-2">Tags</h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in recipe.tags.split(',')"
            :key="tag"
            class="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-1"
          >
            {{ tag.trim() }}
          </span>
        </div>
      </div>

      <!-- Recipe Actions -->
      <!-- Only keep Save Recipe, Share Recipe and Favorite buttons at bottom -->
      <div class="flex gap-4 mt-8">
        <button class="btn btn-primary">
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Save Recipe
        </button>
        <button class="btn btn-secondary">
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Share Recipe
        </button>
        <!-- Favorite button remains the same -->
        <button 
          @click="toggleFavorite"
          class="btn"
          :class="recipe?.is_favorite ? 'btn-primary' : 'btn-secondary'"
          :disabled="recipeStore.loading"
        >
          <!-- Use v-if to switch between filled and outlined star -->
          <svg v-if="recipe?.is_favorite" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          <svg v-else class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
          {{ recipe?.is_favorite ? 'Remove from Favorites' : 'Add to Favorites' }}
          <span class="ml-2 text-sm">({{ recipe?.total_favorites || 0 }})</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipeStore } from '../stores/recipes'
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'
import { DEFAULT_RECIPE_IMAGE } from '../utils/imageUtils'


const route = useRoute()
const router = useRouter()
const recipeStore = useRecipeStore()
const authStore = useAuthStore()
const { loading, error } = storeToRefs(recipeStore)
const recipe = ref(null)

const actionMessage = ref('')

// Show message temporarily
const showMessage = (message) => {
  actionMessage.value = message
  setTimeout(() => {
    actionMessage.value = ''
  }, 3000)
}

const toggleFavorite = async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  // Guard against null recipe
  if (!recipe.value) {
    console.error('Cannot toggle favorite: Recipe is null')
    showMessage('Error: Recipe not found')
    return
  }

  try {
    const id = parseInt(recipe.value.id, 10)
    const currentFavoriteStatus = recipe.value.is_favorite ?? false
    
    await recipeStore.markFavorite(id, !currentFavoriteStatus)
    await fetchRecipeDetail()
    
    showMessage(recipe.value.is_favorite 
      ? 'Recipe added to favorites' 
      : 'Recipe removed from favorites'
    )
  } catch (error) {
    showMessage('Failed to update favorites')
    console.error('Favorite toggle error:', error)
  }
}

const fetchRecipeDetail = async () => {
  try {
    const id = parseInt(route.params.id, 10)
    await recipeStore.fetchRecipeById(id)
    
    // Guard against null recipe
    if (!recipeStore.currentRecipe) {
      console.warn('Recipe not found or returned null')
      error.value = 'Recipe not found'
      return
    }

    recipe.value = recipeStore.currentRecipe

    // Enhanced debug logging
    console.group('Recipe Detail Debug Info')
    console.log('Recipe:', {
      id: recipe.value?.id,
      title: recipe.value?.title,
      ownerId: recipe.value?.owner_id,
      favoriteStatus: recipe.value?.is_favorite ?? 'not set',
      totalFavorites: recipe.value?.total_favorites ?? 0
    })
    console.log('Current User:', {
      id: authStore.user?.id,
      email: authStore.user?.email,
      isAuthenticated: authStore.isAuthenticated
    })
    console.groupEnd()
    
  } catch (err) {
    console.error('Error fetching recipe detail:', err)
    error.value = 'Unable to load recipe details.'
  }
}

const isUserRecipe = computed(() => {
  const authState = authStore.getUserState()
  
  console.group('Recipe Ownership Check')
  console.log('Auth State:', authState)
  console.log('Recipe:', {
    id: recipe.value?.id,
    ownerId: recipe.value?.owner_id
  })
  console.groupEnd()

  return recipe.value?.owner_id === authStore.user?.id
})

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this recipe?')) return

  try {
    await recipeStore.deleteRecipe(recipe.value.id)
    showMessage('Recipe deleted successfully')
    // Redirect to my recipes if coming from there, otherwise to browse
    const redirectPath = route.query.from === 'my-recipes' ? '/my-recipes' : '/browse'
    router.push(redirectPath)
  } catch (err) {
    showMessage('Failed to delete recipe')
    console.error('Delete error:', err)
  }
}

onMounted(() => {
  fetchRecipeDetail()
})
</script>