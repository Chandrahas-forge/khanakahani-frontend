// filepath: c:\Users\Chand\OneDrive\Desktop\Github\khanakahani-frontend\src\test\setup.js
import { vi } from 'vitest'

// Partial mock of vue-router - preserve core functionality but mock composables
vi.mock('vue-router', async (importOriginal) => {
  // Get the actual module first
  const actual = await importOriginal()
  
  // Return everything from the original module, but override specific functions
  return {
    ...actual,
    // Only mock the composables, not the router creation functions
    useRouter: () => ({
      push: vi.fn(),
      back: vi.fn()
    }),
    useRoute: () => ({
      params: {},
      query: {}
    })
  }
})

// Mock image utils
vi.mock('@/utils/imageUtils', () => {
  return {
    DEFAULT_RECIPE_IMAGE: 'mock-image.jpg',
    getRandomRecipeImage: vi.fn().mockReturnValue('mock-image.jpg'),
    getRecipeImage: vi.fn().mockReturnValue('mock-image.jpg')
  }
})