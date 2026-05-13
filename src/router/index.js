import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import PromotionsPage from '@/pages/PromotionsPage.vue'
import AgentDashboard from '@/pages/AgentDashboard.vue'
import ServicePage from '@/pages/ServicePage.vue'
import AccountPage from '@/pages/AccountPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import AdminDashboard from '@/pages/AdminDashboard.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: HomePage },
  { path: '/promotions', component: PromotionsPage, meta: { requiresAuth: true } },
  { path: '/agent', component: AgentDashboard, meta: { requiresAuth: true } },
  { path: '/service', component: ServicePage, meta: { requiresAuth: true } },
  { path: '/account', component: AccountPage, meta: { requiresAuth: true } },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/admin', component: AdminDashboard }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('sb_token')
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to Home with query parameter to trigger login modal
    next('/home?auth=login')
  } else {
    next()
  }
})

export default router
