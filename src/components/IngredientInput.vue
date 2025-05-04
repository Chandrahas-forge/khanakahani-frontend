<template>
  <div class="mb-6">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Ingredients
    </label>
    
    <!-- Input with add button -->
    <div class="flex gap-2 mb-2">
      <input
        v-model="newIngredient"
        type="text"
        class="input flex-grow"
        placeholder="Type an ingredient and press Add"
        maxlength="35"
        @keyup.enter.prevent="addIngredient"
      >
      <button
        type="button"
        class="btn btn-primary"
        @click="addIngredient"
        :disabled="!isValidInput"
      >
        Add
      </button>
    </div>

    <!-- Error message -->
    <p v-if="error" class="text-red-500 text-sm mt-1">
      {{ error }}
    </p>

    <!-- Ingredients list -->
    <div class="mt-3">
      <div class="space-y-2">
        <div
          v-for="(ingredient, index) in ingredients"
          :key="index"
          class="flex items-center gap-2 bg-gray-50 p-2 rounded-md group"
        >
          <span class="flex-grow">{{ ingredient }}</span>
          <button
            type="button"
            class="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            @click="removeIngredient(index)"
            title="Remove ingredient"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <p v-if="ingredients.length === 0" class="text-gray-500 text-sm mt-2 italic">
      No ingredients added yet
    </p>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const ingredients = ref(Array.isArray(props.modelValue) ? props.modelValue : [])
const newIngredient = ref('')
const error = ref('')

const isValidInput = computed(() => {
  return newIngredient.value.trim().length > 0 && 
         newIngredient.value.trim().length <= 35
})

// Watch for changes and emit updates
watch(ingredients, (newVal) => {
  emit('update:modelValue', newVal)
}, { deep: true })

const addIngredient = () => {
  const ingredient = newIngredient.value.trim()
  
  if (!ingredient) {
    error.value = 'Please enter an ingredient'
    return
  }

  if (ingredient.length > 35) {
    error.value = 'Ingredient must be 35 characters or less'
    return
  }

  if (ingredients.value.includes(ingredient)) {
    error.value = 'This ingredient is already in the list'
    return
  }

  ingredients.value.push(ingredient)
  newIngredient.value = ''
  error.value = ''
}

const removeIngredient = (index) => {
  ingredients.value.splice(index, 1)
}
</script>