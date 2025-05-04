<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Grocery List</h1>

    <!-- Add Item Form -->
    <div class="mb-8 bg-white rounded-lg shadow p-6">
      <form @submit.prevent="addItem" class="flex gap-4">
        <input
          v-model="newItem"
          type="text"
          placeholder="Add item to grocery list..."
          class="flex-1 input"
          required
        >
        <button type="submit" class="btn btn-primary">
          Add Item
        </button>
      </form>
    </div>

    <!-- Grocery List -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="groceryList.length === 0" class="p-6 text-center text-gray-500">
        Your grocery list is empty. Add some items to get started!
      </div>
      <ul v-else class="divide-y divide-gray-200">
        <li v-for="(item, index) in groceryList" :key="index" class="p-4 flex items-center justify-between">
          <div class="flex items-center">
            <input
              type="checkbox"
              v-model="item.completed"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            >
            <span :class="{'line-through text-gray-400': item.completed}" class="ml-3">
              {{ item.name }}
            </span>
          </div>
          <button
            @click="removeItem(index)"
            class="text-red-600 hover:text-red-800"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </li>
      </ul>
    </div>

    <!-- Actions -->
    <div class="mt-6 flex justify-between">
      <button
        @click="clearCompleted"
        class="btn btn-secondary"
        :disabled="!hasCompletedItems"
      >
        Clear Completed
      </button>
      <button
        @click="clearAll"
        class="btn btn-danger"
        :disabled="groceryList.length === 0"
      >
        Clear All
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const groceryList = ref([])
const newItem = ref('')

const hasCompletedItems = computed(() => {
  return groceryList.value.some(item => item.completed)
})

const addItem = () => {
  if (newItem.value.trim()) {
    groceryList.value.push({
      name: newItem.value.trim(),
      completed: false
    })
    newItem.value = ''
  }
}

const removeItem = (index) => {
  groceryList.value.splice(index, 1)
}

const clearCompleted = () => {
  groceryList.value = groceryList.value.filter(item => !item.completed)
}

const clearAll = () => {
  groceryList.value = []
}
</script> 