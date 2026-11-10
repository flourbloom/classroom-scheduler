<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Role } from '@/types'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Detect whether the current page is the login page
const isLoginPage = computed(() => route.path === '/login')

// Navigation is locked when the user is not authenticated
const isNavLocked = computed(
  () => isLoginPage.value || !authStore.isAuthenticated
)

function navigateTo(path: string) {
  if (isNavLocked.value) return
  router.push(path) 
}

</script>

<template>
  <nav class="navbar">
    <RouterLink to="/" class="brand">
      ClassroomHub
    </RouterLink>

    <div class="nav-links">
      <button
        :disabled="isNavLocked"
        :class="{ locked: isNavLocked }"
        @click="navigateTo('/schedule')"
      >
        Timetable
      </button>

      <button
        :disabled="isNavLocked"
        :class="{ locked: isNavLocked }"
        @click="navigateTo('/availability')"
      >
        Find a Room
      </button>

      <button
        :disabled="isNavLocked"
        :class="{ locked: isNavLocked }"
        @click="navigateTo('/sessions')"
      >
        All Sessions
      </button>

      <button
        :disabled="isNavLocked || authStore.currentUser?.role !== Role.Admin"
        :class="{
          locked: isNavLocked || authStore.currentUser?.role !== Role.Admin
        }"
        @click="navigateTo('/admin')"
      >
        Manage Admin
      </button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: #1c1e20;
  color: white;
}

.brand {
  color: white;
  font-weight: 700;
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-links button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: white;
  cursor: pointer;
}

.nav-links button:hover:not(:disabled) {
  background: #34383c;
}

.nav-links button.locked,
.nav-links button:disabled {
  color: #85898d;
  cursor: not-allowed;
  opacity: 0.55;
}
</style>