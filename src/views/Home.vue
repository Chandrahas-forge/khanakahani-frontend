<template>
  <div>
    <!-- Hero Section -->
    <div class="relative bg-gray-900">
      <div class="absolute inset-0">
        <img
          class="w-full h-full object-cover"
          :src="DEFAULT_RECIPE_IMAGE"
          alt="Food background"
        >
        <div class="absolute inset-0 bg-gray-900 opacity-60"></div>
      </div>
      <div class="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Food Blog
        </h1>
        <p class="mt-6 text-xl text-gray-300 max-w-3xl">
          Share recipes with friends, rate recipes, store your favorite recipes to find easily, and more.
          Start your culinary journey today!
        </p>
      </div>
    </div>

    <!-- Recipe Grid -->
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="recipe in recipes" :key="recipe.id" class="bg-white rounded-lg shadow overflow-hidden">
          <div class="aspect-w-16 aspect-h-9">
            <img
              :src="getRandomRecipeImage()"
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
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRecipeStore } from '../stores/recipes'
import { storeToRefs } from 'pinia'
import { getRandomRecipeImage, DEFAULT_RECIPE_IMAGE } from '../utils/imageUtils'

const recipeStore = useRecipeStore()
const { recipes, loading, error } = storeToRefs(recipeStore)

onMounted(() => {
  recipeStore.fetchRecipes()
})
</script>