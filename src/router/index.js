import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Recipes from '../views/Recipes.vue'
import RecipeDetail from '../views/RecipeDetail.vue'
import CreateRecipe from '../views/CreateRecipe.vue'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/explore',
      name: 'explore',
      component: () => import('../views/Explore.vue')
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: Recipes
    },
    {
      path: '/recipes/:id',
      name: 'recipe-detail',
      component: RecipeDetail
    },
    {
      path: '/create-recipe',
      name: 'create-recipe',
      component: CreateRecipe
    },
    {
      path: '/grocery-list',
      name: 'grocery-list',
      component: () => import('../views/GroceryList.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/my-recipes',
      name: 'MyRecipes',
      component: () => import('@/views/MyRecipes.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

export default router