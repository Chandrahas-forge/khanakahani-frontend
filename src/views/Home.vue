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
        <div class="absolute inset-0 bg-gray-900 opacity-60" />
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

    <!-- Welcome Section -->
    <div class="container mx-auto px-4 py-12">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-8">
          Welcome to KhanaKahani
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          Your personal recipe management app
        </p>
        <div class="space-x-4">
          <router-link 
            v-if="!authStore.isAuthenticated"
            to="/login" 
            class="btn btn-primary"
          >
            Get Started
          </router-link>
          <router-link 
            v-else 
            to="/browse" 
            class="btn btn-primary"
          >
            Browse Recipes
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DEFAULT_RECIPE_IMAGE } from '../utils/imageUtils'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>