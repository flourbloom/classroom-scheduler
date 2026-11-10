
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => {
    return currentUser.value !== null && token.value !== null
  })

  function setSession(user: User, accessToken: string) {
    currentUser.value = user
    token.value = accessToken
  }

  function logout() {
    currentUser.value = null
    token.value = null
  }

  return {
    currentUser,
    token,
    isAuthenticated,
    setSession,
    logout,
  }
})
