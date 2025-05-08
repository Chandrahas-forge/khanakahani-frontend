import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Recipes from '../views/Recipes.vue'
import CreateRecipe from '../views/CreateRecipe.vue'
import EditRecipe from '../views/EditRecipe.vue'
import Login from '../views/Login.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/browse',
    name: 'browse',
    component: Recipes
  },
  {
    path: '/recipes',
    redirect: '/browse'
  },
  {
    path: '/recipes/:id',
    name: 'RecipeDetail',
    component: () => import('../views/RecipeDetail.vue'),
    props: true
  },
  {
    path: '/create-recipe',
    name: 'create-recipe',
    component: CreateRecipe
  },
  {
    path: '/recipes/:id/edit',
    name: 'edit-recipe',
    component: EditRecipe,
    props: true,
    meta: { requiresAuth: true }
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
  },
  {
    path: '/recipe/:id',
    redirect: to => {
      return { path: `/recipes/${to.params.id}` }
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router