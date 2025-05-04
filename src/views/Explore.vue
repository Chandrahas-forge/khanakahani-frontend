<template>
  <div class="flex min-h-screen">
    <!-- Main Content (Left Side) -->
    <div class="flex-1 px-4 py-8 overflow-y-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Explore Recipes</h1>

      <!-- Trending Section -->
      <div class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Trending Now</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div v-for="recipe in trendingRecipes" :key="recipe.id" class="bg-white rounded-lg shadow overflow-hidden">
            <div class="aspect-w-16 aspect-h-9">
              <img
                :src="recipe.image"
                :alt="recipe.title"
                class="w-full h-48 object-cover"
              >
            </div>
            <div class="p-4">
              <h3 class="text-lg font-medium text-gray-900">
                <router-link :to="`/recipes/${recipe.id}`" class="hover:text-primary-600">
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
    </div>

    <!-- Categories Sidebar (Right Side) -->
    <div class="w-80 bg-gray-50 border-l border-gray-200 p-6 fixed right-0 top-0 h-screen overflow-y-auto">
      <h2 class="text-xl font-semibold text-gray-800 mb-6">Categories</h2>
      <div class="space-y-4">
        <div v-for="category in categories" :key="category.id" 
             class="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="text-2xl mr-3">{{ category.icon }}</div>
            <div>
              <h3 class="font-medium text-gray-900">{{ category.name }}</h3>
              <p class="text-sm text-gray-500">{{ category.count }} recipes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Sample data - replace with actual data from your API
const trendingRecipes = ref([
  {
    id: 1,
    title: 'Classic Margherita Pizza',
    description: 'A simple yet delicious pizza with fresh tomatoes, mozzarella, and basil.',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3',
    rating: 4,
    date: '2024-03-15'
  },
  {
    id: 2,
    title: 'Chocolate Lava Cake',
    description: 'Rich and decadent chocolate cake with a molten center.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c',
    rating: 5,
    date: '2024-03-14'
  },
  {
    id: 3,
    title: 'Grilled Salmon',
    description: 'Perfectly grilled salmon with lemon and herbs.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
    rating: 4,
    date: '2024-03-13'
  }
])

const categories = ref([
  { id: 1, name: 'Breakfast', icon: '🍳', count: 45 },
  { id: 2, name: 'Lunch', icon: '🥪', count: 78 },
  { id: 3, name: 'Dinner', icon: '🍽️', count: 92 },
  { id: 4, name: 'Desserts', icon: '🍰', count: 56 },
  { id: 5, name: 'Drinks', icon: '🥤', count: 34 },
  { id: 6, name: 'Snacks', icon: '🍿', count: 67 }
])
</script> 