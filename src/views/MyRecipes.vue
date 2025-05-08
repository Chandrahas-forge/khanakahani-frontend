<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header with Create Button -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-900">My Recipes</h1>
      <router-link to="/create-recipe" class="btn btn-primary">
        Create Recipe
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12 text-red-500">
      {{ error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="!userRecipes.length" class="text-center py-12">
      <h3 class="text-lg font-medium text-gray-900">No recipes yet</h3>
      <p class="mt-1 text-gray-500">Start by creating your first recipe!</p>
    </div>

    <!-- Recipe Grid -->
    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="recipe in userRecipes"
        :key="recipe.id"
        class="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <!-- Recipe Image -->
        <div class="aspect-w-16 aspect-h-9 bg-gray-100">
          <img
            :src="getRecipeImage(recipe.id)"
            :alt="recipe.title"
            class="object-cover w-full h-full"
            @error="$event.target.src = DEFAULT_RECIPE_IMAGE"
          />
        </div>

        <!-- Recipe Content -->
        <div class="p-4">
          <h2 class="text-xl font-semibold mb-2">{{ recipe.title }}</h2>
          <span class="inline-block px-2 py-1 text-sm rounded-full bg-primary-100 text-primary-800">
            {{ recipe.cuisine }}
          </span>

          <!-- Recipe Tags -->
          <div v-if="recipe.tags" class="mt-3 flex flex-wrap gap-2">
            <span
              v-for="tag in recipe.tags.split(',')"
              :key="tag"
              class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
            >
              {{ tag.trim() }}
            </span>
          </div>

          <!-- Actions -->
          <div class="mt-4 flex justify-end space-x-2">
            <router-link
              :to="`/recipes/${recipe.id}`"
              class="btn btn-secondary"
              title="View recipe"
            >
              View
            </router-link>
            <router-link
              :to="`/recipes/${recipe.id}/edit`"
              class="btn btn-secondary"
              title="Edit recipe"
            >
              Edit
            </router-link>
            <button
              @click="deleteRecipe(recipe.id)"
              class="btn btn-secondary text-red-600"
              title="Delete recipe"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRecipeStore } from '../stores/recipes'
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'
import { getRecipeImage, DEFAULT_RECIPE_IMAGE } from '../utils/imageUtils'

const recipeStore = useRecipeStore()
const authStore = useAuthStore()
const { recipes, loading, error } = storeToRefs(recipeStore)

// Debug logging
console.log('Auth User:', authStore.user)
console.log('All Recipes:', recipes.value)

// Filter recipes to show only user's recipes
const userRecipes = computed(() => {
  // Add null check and debug logging
  if (!authStore.user) {
    console.warn('No authenticated user found')
    return []
  }

  const filtered = recipes.value.filter(recipe => {
    console.log('Recipe:', recipe)
    // Check both owner_id and user_id as FastAPI might use either
    return recipe.owner_id === authStore.user.id || 
           recipe.user_id === authStore.user.id
  })

  console.log('Filtered Recipes:', filtered)
  return filtered
})

// Watch for changes in recipes or auth state
watch([() => recipes.value, () => authStore.user], ([newRecipes, newUser]) => {
  console.log('Recipes changed:', newRecipes)
  console.log('User changed:', newUser)
}, { deep: true })

const deleteRecipe = async (id) => {
  if (window.confirm('Are you sure you want to delete this recipe?')) {
    try {
      await recipeStore.deleteRecipe(id)
    } catch (err) {
      console.error('Failed to delete recipe:', err)
    }
  }
}

onMounted(async () => {
  // Make sure we have the user data
  if (!authStore.user) {
    console.warn('No user data, fetching...')
    await authStore.checkAuth()
  }
  await recipeStore.fetchRecipes()
})
</script>