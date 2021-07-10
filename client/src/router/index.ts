import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import MemoriesPage from "../views/MemoriesPage.vue";
import Signup from "../views/Signup.vue"
import Login from "../views/Login.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: MemoriesPage
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/signup',
    component: Signup
  },
  {
    path: '/memories/:id',
    component: () => import("../views/MemoryDetails.vue")
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
