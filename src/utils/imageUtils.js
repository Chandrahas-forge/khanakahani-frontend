const recipeImages = [
    '/src/assets/recipe-images/recipe1.png',
    '/src/assets/recipe-images/recipe2.png',
    '/src/assets/recipe-images/recipe3.png',
    '/src/assets/recipe-images/recipe4.png',
    '/src/assets/recipe-images/recipe5.png',
    '/src/assets/recipe-images/recipe6.png',
    '/src/assets/recipe-images/recipe7.png',
    '/src/assets/recipe-images/recipe8.png',
    '/src/assets/recipe-images/recipe9.png',
    '/src/assets/recipe-images/recipe10.png',
    '/src/assets/recipe-images/recipe11.png',
    '/src/assets/recipe-images/recipe12.png',
    '/src/assets/recipe-images/recipe13.png',
    '/src/assets/recipe-images/recipe14.png',
    '/src/assets/recipe-images/recipe15.png'
]

// Get consistent image for a recipe ID
export const getRecipeImage = (recipeId) => {
    if (!recipeId) {
        console.warn('No recipe ID provided to getRecipeImage')
        return getRandomRecipeImage()
    }
    const id = parseInt(recipeId, 10)
    const imageIndex = (id % 15) + 1 // Maps 1-15 directly
    return new URL(`../assets/recipe-images/recipe${imageIndex}.png`, import.meta.url).href
}

// Fallback for when no recipe ID is available
export const getRandomRecipeImage = () => {
    const randomIndex = Math.floor(Math.random() * 15) + 1
    return new URL(`../assets/recipe-images/recipe${randomIndex}.png`, import.meta.url).href
}

export const DEFAULT_RECIPE_IMAGE = new URL('../assets/recipe-images/recipe1.png', import.meta.url).href