<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">
      Edit Recipe
    </h1>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="text-center py-12"
    >
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
      <p class="mt-4 text-gray-500">
        Loading recipe...
      </p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="text-center py-12"
    >
      <p class="text-red-500">
        {{ error }}
      </p>
    </div>

    <form
      v-else
      class="max-w-2xl mx-auto"
      @submit.prevent="handleSubmit"
    >
      <!-- Add error message display -->
      <div
        v-if="recipeStore.error"
        class="mb-6 p-4 bg-red-100 text-red-700 rounded"
      >
        {{ recipeStore.error }}
      </div>

      <!-- Title -->
      <div class="mb-6">
        <label
          for="title"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          Recipe Title
        </label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          class="input"
          required
        >
      </div>


      <!-- Cuisine Type -->
      <div class="mb-6">
        <label
          for="cuisine"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          Cuisine Type
        </label>
        <select
          id="cuisine"
          v-model="form.cuisine"
          class="input"
          required
        >
          <option value="">
            Select cuisine type
          </option>
          <option
            v-for="cuisine in cuisineTypes"
            :key="cuisine"
            :value="cuisine"
          >
            {{ cuisine }}
          </option>
        </select>
      </div>

      <!-- Ingredients -->
      <IngredientInput v-model="form.ingredients" />

      <!-- Steps -->
      <div class="mb-6">
        <label
          for="steps"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          Cooking Steps
        </label>
        <textarea
          id="steps"
          v-model="form.steps"
          rows="6"
          class="input"
          required
        />
      </div>

      <!-- Tags -->
      <div class="mb-6">
        <label
          for="tags"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          Tags
        </label>
        <input
          id="tags"
          v-model="form.tags"
          type="text"
          class="input"
          placeholder="Enter tags separated by commas"
        >
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end gap-4">
        <button
          type="button"
          class="btn btn-secondary"
          @click="router.back()"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="recipeStore.loading"
        >
          <span v-if="recipeStore.loading">Saving...</span>
          <span v-else>Save Changes</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipeStore } from '../stores/recipes'
import { useAuthStore } from '../stores/auth'
import IngredientInput from '@/components/IngredientInput.vue'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const recipeStore = useRecipeStore()
const authStore = useAuthStore()
const { loading, error } = storeToRefs(recipeStore)

// Redirect if not authenticated
if (!authStore.isAuthenticated) {
  router.push('/login')
}

const cuisineTypes = [
  'Italian', 'Chinese', 'Japanese', 'Mexican', 'Indian', 
  'French', 'Thai', 'American', 'Mediterranean', 'Other'
]

// Fix form initialization with proper defaults
const form = ref({
  title: '',
  cuisine: '',
  ingredients: [], // Will be populated from API
  steps: '',
  tags: '',
  image: '',
  rating: 0
})

// Modify the onMounted function to properly handle all fields
onMounted(async () => {
  try {
    const recipeId = parseInt(route.params.id)
    await recipeStore.fetchRecipeById(recipeId)
    
    if (!recipeStore.currentRecipe) {
      error.value = 'Recipe not found'
      return
    }

    // Add detailed logging
    console.group('Recipe Data')
    console.log('Raw recipe:', recipeStore.currentRecipe)
    console.log('Ingredients:', recipeStore.currentRecipe.ingredients)
    console.groupEnd()

    const recipe = recipeStore.currentRecipe
    
    // Pre-populate form
    form.value = {
      ...form.value, // Keep default values
      ...recipe, // Spread existing recipe data
      // Handle special cases explicitly
      ingredients: Array.isArray(recipe.ingredients) ? [...recipe.ingredients] : [],
      tags: Array.isArray(recipe.tags) ? recipe.tags.join(', ') : recipe.tags || ''
    }

    // Verify form population
    console.group('Form Data')
    console.log('Form after population:', form.value)
    console.log('Ingredients length:', form.value.ingredients.length)
    console.groupEnd()
  } catch (err) {
    console.error('Error loading recipe:', err)
    error.value = 'Failed to load recipe'
  }
})

// Update handleSubmit to properly format data before sending
const handleSubmit = async () => {
  try {
    const recipeId = parseInt(route.params.id)
    const recipeData = {
      title: form.value.title?.trim() || '',
      cuisine: form.value.cuisine,
      ingredients: form.value.ingredients,
      steps: form.value.steps?.trim() || '',
      // Convert tags array to comma-separated string
      tags: Array.isArray(form.value.tags) 
        ? form.value.tags.join(', ')
        : form.value.tags?.trim() || '',
      image: form.value.image?.trim() || ''
    }

    console.log('Submitting recipe data:', recipeData)
    await recipeStore.updateRecipe(recipeId, recipeData)
    router.push('/recipes/' + recipeId)
  } catch (error) {
    console.error('Error updating recipe:', error)
    recipeStore.error = 'Failed to update recipe'
  }
}
</script>