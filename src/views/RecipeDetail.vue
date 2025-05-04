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
        <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ recipe.title }}</h1>
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
          v-if="recipe.image"
          :src="recipe.image"
          :alt="recipe.title"
          class="w-full h-96 object-cover rounded-lg shadow-lg"
        >
        <div v-else class="h-64 bg-gray-100 flex items-center justify-center text-gray-400">
          <span>No Image Available</span>
        </div>
      </div>

      <!-- Recipe Description -->
      <div class="prose max-w-none mb-8">
        <p class="text-lg text-gray-700">{{ recipe.description }}</p>
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
      <div class="flex gap-4">
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
        <!-- Add favorite button -->
        <button 
          @click="toggleFavorite"
          class="btn"
          :class="recipe.is_favorite ? 'btn-primary' : 'btn-secondary'"
          :disabled="recipeStore.loading"
        >
          <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          {{ recipe.is_favorite ? 'Remove from Favorites' : 'Add to Favorites' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipeStore } from '../stores/recipes'
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'

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

  try {
    if (recipe.value.is_favorite) {
      await recipeStore.removeFavorite(recipe.value.id)
      showMessage('Recipe removed from favorites')
    } else {
      await recipeStore.markFavorite(recipe.value.id)
      showMessage('Recipe added to favorites')
    }
  } catch (error) {
    showMessage('Failed to update favorites')
  }
}
const fetchRecipeDetail = async () => {
  try {
    const id = route.params.id
    await recipeStore.fetchRecipeById(id)
    recipe.value = recipeStore.currentRecipe
  } catch (err) {
    console.error('Error fetching recipe detail:', err)
    error.value = 'Unable to load recipe details.'
  }
}
onMounted(() => {
  fetchRecipeDetail()
})
</script>