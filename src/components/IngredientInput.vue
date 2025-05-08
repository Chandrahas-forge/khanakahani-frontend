<template>
  <div class="mb-6">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Ingredients
    </label>
    <div 
      v-for="(ingredient, index) in localIngredients" 
      :key="index" 
      class="flex gap-2 mb-2"
    >
      <input 
        v-model="localIngredients[index]"
        type="text"
        class="input flex-grow"
        @input="updateParent"
      >
      <button 
        type="button" 
        class="btn btn-danger px-2 py-1"
        aria-label="Remove ingredient"
        @click="removeIngredient(index)"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
    <button 
      type="button"
      class="btn btn-secondary mt-2"
      @click="addIngredient"
    >
      Add Ingredient
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// Local copy of ingredients
const localIngredients = ref([...props.modelValue])

// Watch for external changes
watch(() => props.modelValue, newValue => {
  localIngredients.value = [...newValue]
}, { deep: true })

const updateParent = () => {
  emit('update:modelValue', [...localIngredients.value])
}

const addIngredient = () => {
  localIngredients.value.push('')
  updateParent()
}

const removeIngredient = index => {
  localIngredients.value.splice(index, 1)
  updateParent()
}
</script>