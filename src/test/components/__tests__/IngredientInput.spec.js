import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IngredientInput from '@/components/IngredientInput.vue'


describe('IngredientInput.vue', () => {
  it('renders all ingredients', () => {
    const wrapper = mount(IngredientInput, {
      props: {
        modelValue: ['Ingredient 1', 'Ingredient 2']
      }
    })
    
    const inputs = wrapper.findAll('input[type="text"]')
    expect(inputs).toHaveLength(2)
    expect(inputs[0].element.value).toBe('Ingredient 1')
  })

  it('emits update on input change', async () => {
    const wrapper = mount(IngredientInput, {
      props: {
        modelValue: ['']
      }
    })

    await wrapper.find('input').setValue('New Ingredient')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('adds new ingredient when button clicked', async () => {
    const wrapper = mount(IngredientInput, {
      props: {
        modelValue: ['Initial ingredient']
      }
    })

    // Find the Add Ingredient button more specifically
    const addButton = wrapper.findAll('button[type="button"]')
      .find(btn => btn.text().includes('Add Ingredient'))
    
    expect(addButton.exists()).toBe(true)
    await addButton.trigger('click')
    
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted[0][0]).toEqual(['Initial ingredient', ''])
  })

  it('removes ingredient when delete button clicked', async () => {
    const wrapper = mount(IngredientInput, {
      props: {
        modelValue: ['Ingredient 1', 'Ingredient 2']
      }
    })

    await wrapper.findAll('.btn-danger')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')[0][0]).toHaveLength(1)
  })

  it('handles empty initial props', () => {
    const wrapper = mount(IngredientInput, {
      props: {
        modelValue: []
      }
    })

    expect(wrapper.findAll('input')).toHaveLength(0)
  })

  it('updates local ingredients when props change', async () => {
    const wrapper = mount(IngredientInput, {
      props: {
        modelValue: ['Initial']
      }
    })

    await wrapper.setProps({
      modelValue: ['Updated']
    })

    const input = wrapper.find('input')
    expect(input.element.value).toBe('Updated')
  })

  it('handles input changes correctly', async () => {
    const wrapper = mount(IngredientInput, {
      props: {
        modelValue: ['']
      }
    })

    const input = wrapper.find('input')
    await input.setValue('New Value')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted[0][0]).toEqual(['New Value'])
  })
})