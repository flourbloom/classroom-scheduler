import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/Login.vue'
import Schedule from '@/components/Schedule.vue'
import Rooms from '@/components/Rooms.vue'
import Sessions from '@/components/Sessions.vue'
import Admin from '@/components/Admin.vue'


const routes = [
  { path: '/schedule', name: 'Schedule', component: Schedule },
  { path: '/', name: 'Schedule', component: Schedule },
  { path: '/login', name: 'Login', component: Login },
  { path: '/rooms', name: 'Rooms', component: Rooms },
  { path: '/sessions', name: 'Sessions', component: Sessions },
  { path: '/admin', name: 'Admin', component: Admin },
]

export default createRouter({
  history: createWebHistory(),
  routes
})



