// Get consistent image for a recipe ID
export const getRecipeImage = recipeId => {
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