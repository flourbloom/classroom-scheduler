import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Role } from '@/types'

// lazy loading
const Schedule = () => import('@/components/Schedule.vue')

const routes = [
  // HOME
  { path: '/', redirect: '/schedule' },
  { path: '/schedule', name: 'Schedule', component: () => import('@/components/Schedule.vue') },

  // LOGIN
  { path: '/login', name: 'Login', component: () => import('@/components/Login.vue') },

  // ROOMS
  { path: '/rooms', name: 'Rooms', component: () => import('@/components/Rooms.vue') },
  {
    path: '/rooms/:id(\\d+)', name: 'RoomDetail', component: () => import('@/components/RoomDetail.vue'),
    props: true
  },

  // SESSIONS
  { path: '/sessions', name: 'Sessions', component: () => import('@/components/Sessions.vue') },

  // ADMIN
  {
    path: '/admin', name: 'Admin', component: () => import('@/components/Admin.vue'),
    meta: { isAdmin: true }
  },

  // LOADING PREVIEW
  { path: '/loading', name: 'Loading', component: () => import('@/components/LoadingPage.vue') },

  //NOT FOUND
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/components/NotFound.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
// guard
router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (to.meta.isAdmin && authStore.currentUser?.role !== Role.Admin) {
    return { name: 'Schedule', query: { denied: '1' } }
  }
})

export default router




