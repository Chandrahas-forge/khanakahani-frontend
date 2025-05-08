<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="container mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="flex items-center">
                <img :src="DEFAULT_RECIPE_IMAGE" alt="Brand" class="h-8 w-auto">
                <span class="ml-2 text-xl font-bold text-primary-600">KhanaKahani</span>
              </router-link>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                v-for="item in navigation"
                :key="item.name"
                :to="item.href"
                :class="[
                  $route.path === item.href
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                ]"
              >
                {{ item.name }}
              </router-link>
            </div>
          </div>
          <div class="flex items-center">
            <template v-if="authStore.isAuthenticated">
              <span class="mr-4 text-gray-600">{{ authStore.user?.email }}</span>
              <button
                @click="handleLogout"
                class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
              >
                Logout
              </button>
            </template>
            <router-link
              v-else
              to="/login"
              class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
            >
              Login
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Add loading overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>

    <!-- Main Content -->
    <main class="flex-grow">
      <router-view></router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t border-gray-200 py-6">
      <div class="container mx-auto px-4">
        <p class="text-center text-gray-500 text-sm">
          <span>Created with <a href="https://github.com/Chandrahas-forge/khanakahani-frontend" class="text-primary-600 hover:text-primary-700">KhanaKahani</a></span>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { DEFAULT_RECIPE_IMAGE } from './utils/imageUtils'

const router = useRouter()
const authStore = useAuthStore()
const { loading } = storeToRefs(authStore)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

// Navigation items based on auth state
const navigation = computed(() => [
  { name: 'Explore', href: '/explore' },
  { name: 'Browse Recipes', href: '/recipes' },
  ...(authStore.isAuthenticated ? [
    { name: 'Create Recipe', href: '/create-recipe' },
    { name: 'My Recipes', href: '/my-recipes' },
    { name: 'Favorites', href: '/favorites' }
  ] : [])
])
</script>