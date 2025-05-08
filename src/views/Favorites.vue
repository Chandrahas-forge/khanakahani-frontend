<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">My Favorite Recipes</h1>

    <div v-if="loading" class="flex justify-center">
      <div class="loader">Loading...</div>
    </div>

    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>

    <div v-else-if="recipes.length === 0" class="text-center text-gray-600">
      <p>No favorite recipes yet.</p>
    </div>

    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div 
        v-for="recipe in recipes" 
        :key="recipe?.id" 
        class="bg-white rounded-lg shadow overflow-hidden"
        v-if="recipe"
      >
        <!-- Recipe Image -->
        <div class="aspect-w-16 aspect-h-9 bg-gray-100">
          <img
            :src="recipe.image || getRecipeImage(recipe.id)"
            :alt="recipe.title"
            class="object-cover w-full h-48"
            @error="$event.target.src = DEFAULT_RECIPE_IMAGE"
          />
        </div>

        <!-- Recipe Content -->
        <div class="p-4">
          <router-link 
            :to="`/recipes/${recipe.id}`"
            class="text-xl font-semibold text-gray-900 hover:text-primary-600"
          >
            {{ recipe.title }}
          </router-link>
          <p class="mt-2 text-gray-600">{{ recipe.cuisine }}</p>
          <div class="mt-4 flex items-center justify-between">
            <span class="text-sm text-gray-500">
              {{ recipe.total_favorites || 0 }} favorites
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRecipeStore } from '../stores/recipes'
import { storeToRefs } from 'pinia'
import { getRecipeImage, DEFAULT_RECIPE_IMAGE } from '../utils/imageUtils'
import { useRouter } from 'vue-router'

const recipeStore = useRecipeStore()
const { loading, error } = storeToRefs(recipeStore)
const recipes = ref([])
const router = useRouter()

onMounted(async () => {
  try {
    await recipeStore.fetchRecipes()
    // Only filter recipes that exist and are marked as favorites
    recipes.value = recipeStore.recipes.filter(recipe => 
      recipe && recipe.is_favorite === true
    )

    if (recipes.value.length === 0) {
      console.log('No favorite recipes found')
    }
  } catch (err) {
    console.error('Error loading favorite recipes:', err)
  }
})

// Add method to handle recipe click
const goToRecipe = (recipeId) => {
  if (recipeId) {
    router.push(`/recipes/${recipeId}`)
  }
}
</script>