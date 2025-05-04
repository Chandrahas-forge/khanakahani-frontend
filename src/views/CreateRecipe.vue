<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Create New Recipe</h1>

    <form @submit.prevent="handleSubmit" class="max-w-2xl mx-auto">
      <!-- Add error message display -->
      <div v-if="recipeStore.error" class="mb-6 p-4 bg-red-100 text-red-700 rounded">
        {{ recipeStore.error }}
      </div>

      <!-- Title -->
      <div class="mb-6">
        <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
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

      <!-- Description -->
      <div class="mb-6">
        <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          v-model="form.description"
          rows="4"
          class="input"
          required
        ></textarea>
      </div>

      <!-- Add cuisine field -->
      <div class="mb-6">
        <label for="cuisine" class="block text-sm font-medium text-gray-700 mb-2">
          Cuisine Type
        </label>
        <select id="cuisine" v-model="form.cuisine" class="input" required>
          <option value="">Select cuisine type</option>
          <option v-for="cuisine in cuisineTypes" :key="cuisine" :value="cuisine">
            {{ cuisine }}
          </option>
        </select>
      </div>

      <!-- Replace the old ingredients textarea with the new component -->
      <IngredientInput
        v-model="form.ingredients"
      />

      <!-- Add steps field -->
      <div class="mb-6">
        <label for="steps" class="block text-sm font-medium text-gray-700 mb-2">
          Cooking Steps
        </label>
        <textarea
          id="steps"
          v-model="form.steps"
          rows="6"
          class="input"
          placeholder="Enter cooking steps"
          required
        ></textarea>
      </div>

      <!-- Add tags field -->
      <div class="mb-6">
        <label for="tags" class="block text-sm font-medium text-gray-700 mb-2">
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

      <!-- Image URL -->
      <div class="mb-6">
        <label for="image" class="block text-sm font-medium text-gray-700 mb-2">
          Image URL
        </label>
        <input
          id="image"
          v-model="form.image"
          type="url"
          class="input"
          required
        >
      </div>

      <!-- Rating -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <div class="flex items-center">
          <template v-for="n in 5" :key="n">
            <button
              type="button"
              class="focus:outline-none"
              @click="form.rating = n"
            >
              <svg
                class="h-8 w-8"
                :class="n <= form.rating ? 'text-yellow-400' : 'text-gray-300'"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          </template>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="recipeStore.loading"
        >
          <span v-if="recipeStore.loading">Creating...</span>
          <span v-else>Create Recipe</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRecipeStore } from '../stores/recipes'
import { useAuthStore } from '../stores/auth'
import IngredientInput from '@/components/IngredientInput.vue'

const router = useRouter()
const recipeStore = useRecipeStore()
const authStore = useAuthStore()

// Redirect if not authenticated
if (!authStore.isAuthenticated) {
  router.push('/login')
}

const cuisineTypes = [
  'Italian', 'Chinese', 'Japanese', 'Mexican', 'Indian', 
  'French', 'Thai', 'American', 'Mediterranean', 'Other'
]

const form = ref({
  title: '',
  description: '',
  cuisine: '',
  ingredients: [], // Now this will be an array instead of a string
  steps: '',
  tags: '',
  image: '',
  rating: 0,
  date: new Date().toISOString().split('T')[0]
})

const handleSubmit = async () => {
  try {
    // Properly format the data for API submission
    const recipeData = {
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      cuisine: form.value.cuisine || 'Other',
      ingredients: form.value.ingredients,
      steps: form.value.steps.trim(),
      // Keep tags as a trimmed string
      tags: form.value.tags?.trim() || '',
      image: form.value.image.trim(),
      rating: form.value.rating,
      date: form.value.date
    }

    const recipe = await recipeStore.createRecipe(recipeData)
    if (recipe?.id) {
      router.push(`/recipe/${recipe.id}`)
    }
  } catch (error) {
    console.error('Error creating recipe:', error)
  }
}
</script>