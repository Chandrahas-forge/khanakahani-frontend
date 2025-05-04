<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Browse Recipes</h1>

    <!-- Search and Filter -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input
            type="text"
            placeholder="Search recipes..."
            class="input"
            v-model="searchQuery"
          >
        </div>
        <div class="flex gap-4">
          <select class="input" v-model="sortBy">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p class="mt-4 text-gray-500">Loading recipes...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <!-- Recipe Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        class="bg-white rounded-lg shadow overflow-hidden"
      >
        <div class="aspect-w-16 aspect-h-9">
          <img
            :src="recipe.image"
            :alt="recipe.title"
            class="w-full h-48 object-cover"
          >
        </div>
        <div class="p-4">
          <h3 class="text-lg font-medium text-gray-900">
            <router-link :to="`/recipe/${recipe.id}`" class="hover:text-primary-600">
              {{ recipe.title }}
            </router-link>
          </h3>
          <p class="mt-2 text-sm text-gray-500 line-clamp-2">
            {{ recipe.description }}
          </p>
          <div class="mt-4 flex items-center justify-between">
            <div class="flex items-center">
              <div class="flex items-center">
                <template v-for="n in 5" :key="n">
                  <svg
                    class="h-5 w-5"
                    :class="n <= recipe.rating ? 'text-yellow-400' : 'text-gray-300'"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </template>
              </div>
            </div>
            <span class="text-sm text-gray-500">{{ recipe.date }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRecipeStore } from '../stores/recipes'
import { storeToRefs } from 'pinia'

const recipeStore = useRecipeStore()
const { recipes, loading, error } = storeToRefs(recipeStore)

const searchQuery = ref('')
const sortBy = ref('newest')

const filteredRecipes = computed(() => {
  let filtered = [...recipes.value]
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(recipe => 
      recipe.title.toLowerCase().includes(query) ||
      recipe.description.toLowerCase().includes(query)
    )
  }
  
  // Sort
  switch (sortBy.value) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
      break
    case 'oldest':
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
      break
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating)
      break
  }
  
  return filtered
})

onMounted(() => {
  recipeStore.fetchRecipes()
})
</script> 