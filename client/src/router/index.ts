import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import MemoriesPage from "../views/MemoriesPage.vue";
import Signup from "../views/Signup.vue"
import Login from "../views/Login.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: "home",
    component: MemoriesPage
  },
  {
    path: '/login',
    name: "login",
    component: Login
  },
  {
    path: '/signup',
    name: "signup",
    component: Signup
  },
  {
    path: '/memories/:id',
    name: "memoryDetail",
    component: () => import("../views/MemoryDetails.vue")
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
