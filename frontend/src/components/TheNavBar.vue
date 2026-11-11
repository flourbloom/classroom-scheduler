<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Role, type User } from '@/types'
import { useTheme } from '@/composables/useTheme'
import logoUrl from '../assets/logo.png'

const router = useRouter()
const authStore = useAuthStore()
const { isDark, toggleTheme, initTheme } = useTheme()

onMounted(() => {
  initTheme()
})

if (!authStore.currentUser) {
  const defaultTeacher: User = {
    id: '1',
    name: 'teacher1',
    email: 'teacher1@example.com',
    password: '',
    role: Role.Teacher,
  }
  authStore.setSession(defaultTeacher, 'mock-jwt-token')
}

const currentRole = computed(() => {
  return authStore.currentUser?.role ?? 'Guest'
})


// Dropdown to switch role
function onRoleChange(event: Event) {
  const selected = (event.target as HTMLSelectElement).value
  if (selected === 'Teacher') {
    const teacher: User = {
      id: '1',
      name: 'teacher1',
      email: 'teacher1@example.com',
      password: '',
      role: Role.Teacher,
    }
    authStore.setSession(teacher, 'mock-jwt-token')
  } else if (selected === 'Admin') {
    const admin: User = {
      id: '4',
      name: 'admin',
      email: 'admin@example.com',
      password: '',
      role: Role.Admin,
    }
    authStore.setSession(admin, 'mock-jwt-token')
  } else {
    authStore.logout()
    router.push('/login')
  }
}



function handleSignOut() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="app-nav">
    <div class="nav-left">
      <RouterLink to="/schedule" class="brand-container">
        <div class="brand-mark">
          <img :src="logoUrl" alt="ClassroomHub Logo" class="brand-logo" />
        </div>
        <span class="brand">ClassroomHub</span>
      </RouterLink>

      <nav class="destinations">
        <RouterLink to="/schedule" class="nav-item">
          Timetable
        </RouterLink>
        <RouterLink to="/rooms" class="nav-item">
          Find a room
        </RouterLink>
        <RouterLink to="/sessions" class="nav-item">
          All sessions
        </RouterLink>
        <RouterLink to="/admin" class="nav-item">
          Manage (admin)
        </RouterLink>
      </nav>
    </div>

    <div class="account-area">
      <div class="user-info">
        <span class="user-text">
          {{ authStore.currentUser ? `${authStore.currentUser.name} · ${authStore.currentUser.role}` : 'Guest' }}
        </span>
        <span class="divider">|</span>
        <button v-if="authStore.currentUser" class="signout-btn" @click="handleSignOut">
          Sign out
        </button>
        <RouterLink v-else to="/login" class="login-link">
          Sign in
        </RouterLink>
      </div>

      <div class="role-selector">
        <label for="role-select">Role:</label>
        <select id="role-select" :value="currentRole" @change="onRoleChange">
          <option value="Teacher">Teacher</option>
          <option value="Admin">Admin</option>
          <option value="Guest">Guest</option>
        </select>
      </div>

      <button
        type="button"
        class="theme-toggle-btn"
        :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        @click="toggleTheme"
      >
        <!-- Streamline Pixel Smart Emoji Icon (Active in Dark Mode to switch to Light) -->
        <svg
          v-if="isDark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          id="Email-Emoji-Smile-Smart--Streamline-Pixel"
          class="theme-icon light-icon"
          height="16"
          width="16"
          fill="currentColor"
        >
          <desc>
            Email Emoji Smile Smart Streamline Icon: https://streamlinehq.com
          </desc>
          <title>email-emoji-smile-smart</title>
          <g>
            <path d="M30.48 12.19H32v7.62h-1.52Z" fill="currentColor" stroke-width="1"></path>
            <path d="M28.95 19.81h1.53v3.04h-1.53Z" fill="currentColor" stroke-width="1"></path>
            <path d="M27.43 22.85h1.52v3.05h-1.52Z" fill="currentColor" stroke-width="1"></path>
            <path d="M27.43 6.09h1.52v3.05h-1.52Z" fill="currentColor" stroke-width="1"></path>
            <path d="M25.91 25.9h1.52v1.52h-1.52Z" fill="currentColor" stroke-width="1"></path>
            <path d="M25.91 4.57h1.52v1.52h-1.52Z" fill="currentColor" stroke-width="1"></path>
            <path d="M22.86 27.42h3.05v1.53h-3.05Z" fill="currentColor" stroke-width="1"></path>
            <path d="M22.86 3.04h3.05v1.53h-3.05Z" fill="currentColor" stroke-width="1"></path>
            <path d="M19.81 28.95h3.05v1.52h-3.05Z" fill="currentColor" stroke-width="1"></path>
            <path d="M19.81 1.52h3.05v1.52h-3.05Z" fill="currentColor" stroke-width="1"></path>
            <path d="M12.19 30.47h7.62V32h-7.62Z" fill="currentColor" stroke-width="1"></path>
            <path d="M13.72 22.85h6.09v1.53h-6.09Z" fill="currentColor" stroke-width="1"></path>
            <path d="M12.19 0h7.62v1.52h-7.62Z" fill="currentColor" stroke-width="1"></path>
            <path d="M12.19 21.33h1.53v1.52h-1.53Z" fill="currentColor" stroke-width="1"></path>
            <path d="M9.14 28.95h3.05v1.52H9.14Z" fill="currentColor" stroke-width="1"></path>
            <path d="M9.14 1.52h3.05v1.52H9.14Z" fill="currentColor" stroke-width="1"></path>
            <path d="M6.1 27.42h3.04v1.53H6.1Z" fill="currentColor" stroke-width="1"></path>
            <path d="M6.1 3.04h3.04v1.53H6.1Z" fill="currentColor" stroke-width="1"></path>
            <path d="M4.57 25.9H6.1v1.52H4.57Z" fill="currentColor" stroke-width="1"></path>
            <path d="M4.57 4.57H6.1v1.52H4.57Z" fill="currentColor" stroke-width="1"></path>
            <path d="M3.05 22.85h1.52v3.05H3.05Z" fill="currentColor" stroke-width="1"></path>
            <path d="m3.05 15.23 1.52 0 0 1.53 1.53 0 0 1.52 6.09 0 0 -1.52 1.53 0 0 -1.53 1.52 0 0 -1.52 3.05 0 0 1.52 1.52 0 0 1.53 1.52 0 0 1.52 6.1 0 0 -1.52 1.52 0 0 -4.57 1.53 0 0 -3.05 -1.53 0 0 1.52 -25.9 0 0 -1.52 -1.52 0 0 3.05 1.52 0 0 3.04z" fill="currentColor" stroke-width="1"></path>
            <path d="M3.05 6.09h1.52v3.05H3.05Z" fill="currentColor" stroke-width="1"></path>
            <path d="M1.53 19.81h1.52v3.04H1.53Z" fill="currentColor" stroke-width="1"></path>
            <path d="M0 12.19h1.53v7.62H0Z" fill="currentColor" stroke-width="1"></path>
          </g>
        </svg>

        <!-- Streamline Pixel Crescent Moon & Stars Icon (Active in Light Mode to switch to Dark) -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          id="Weather-Cresent-Moon-Stars--Streamline-Pixel"
          class="theme-icon moon-icon"
          height="16"
          width="16"
          fill="currentColor"
        >
          <title>Switch to dark mode</title>
          <g>
            <path d="m29.71 11.43 -1.52 0 0 1.52 -1.52 0 0 1.53 1.52 0 0 1.52 1.52 0 0 -1.52 1.53 0 0 -1.53 -1.53 0 0 -1.52z" fill="currentColor"></path>
            <path d="M28.19 22.1h1.52v1.52h-1.52Z" fill="currentColor"></path>
            <path d="m26.67 0.76 0 1.53 -1.53 0 0 1.52 1.53 0 0 1.52 1.52 0 0 -1.52 1.52 0 0 -1.52 -1.52 0 0 -1.53 -1.52 0z" fill="currentColor"></path>
            <path d="M25.14 8.38h1.53v1.53h-1.53Z" fill="currentColor"></path>
            <path d="m25.14 26.67 -1.52 0 0 1.52 -1.53 0 0 1.53 1.53 0 0 1.52 1.52 0 0 -1.52 1.53 0 0 -1.53 -1.53 0 0 -1.52z" fill="currentColor"></path>
            <path d="M23.62 19.05h1.52v1.52h-1.52Z" fill="currentColor"></path>
            <path d="m22.09 22.1 -9.14 0 0 1.52 7.62 0 0 1.52 1.52 0 0 -3.04z" fill="currentColor"></path>
            <path d="m12.95 8.38 0 1.53 9.14 0 0 -3.05 -1.52 0 0 1.52 -7.62 0z" fill="currentColor"></path>
            <path d="M17.52 25.14h3.05v1.53h-3.05Z" fill="currentColor"></path>
            <path d="m19.05 19.05 0 -1.52 1.52 0 0 -1.53 -1.52 0 0 -1.52 -1.53 0 0 1.52L16 16l0 1.53 1.52 0 0 1.52 1.53 0z" fill="currentColor"></path>
            <path d="M17.52 5.33h3.05v1.53h-3.05Z" fill="currentColor"></path>
            <path d="M9.9 26.67h7.62v1.52H9.9Z" fill="currentColor"></path>
            <path d="M11.43 20.57h1.52v1.53h-1.52Z" fill="currentColor"></path>
            <path d="M11.43 9.91h1.52v1.52h-1.52Z" fill="currentColor"></path>
            <path d="M9.9 3.81h7.62v1.52H9.9Z" fill="currentColor"></path>
            <path d="M9.9 11.43h1.53v9.14H9.9Z" fill="currentColor"></path>
            <path d="M6.86 25.14H9.9v1.53H6.86Z" fill="currentColor"></path>
            <path d="M6.86 5.33H9.9v1.53H6.86Z" fill="currentColor"></path>
            <path d="M5.33 23.62h1.53v1.52H5.33Z" fill="currentColor"></path>
            <path d="M5.33 6.86h1.53v1.52H5.33Z" fill="currentColor"></path>
            <path d="M3.81 20.57h1.52v3.05H3.81Z" fill="currentColor"></path>
            <path d="M3.81 8.38h1.52v3.05H3.81Z" fill="currentColor"></path>
            <path d="M2.29 29.72h1.52v1.52H2.29Z" fill="currentColor"></path>
            <path d="M2.29 11.43h1.52v9.14H2.29Z" fill="currentColor"></path>
            <path d="M0.76 3.81h1.53v1.52H0.76Z" fill="currentColor"></path>
          </g>
        </svg>
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-nav {
  height: 44px;
  background-color: var(--color-nav-bg, #000000);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  gap: 20px;
  user-select: none;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 24px;
  height: 100%;
}

.brand {
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  text-decoration: none;
  white-space: nowrap;
}

.destinations {
  display: flex;
  align-items: center;
  gap: 20px;
  height: 100%;
}

.nav-item {
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 4px;
  color: var(--color-nav-muted, #a1a1a6);
  font-size: 13.5px;
  font-weight: 400;
  text-decoration: none;
  border-bottom: 3px solid transparent;
  transition: color 0.15s, border-color 0.15s;
  white-space: nowrap;
}

.nav-item:hover {
  color: #ffffff;
}

.nav-item.router-link-active {
  color: #ffffff;
  border-bottom-color: var(--color-lochmara);
  font-weight: 500;
}

.account-area {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-nav-muted);
}

.user-text {
  color: #ffffff;
  font-weight: 500;
}

.divider {
  color: #6e7681;
}

.signout-btn,
.login-link {
  background: none;
  border: none;
  color: #a1a1a6;
  cursor: pointer;
  padding: 0;
  font-size: 13px;
  text-decoration: none;
}

.signout-btn:hover,
.login-link:hover {
  color: #ffffff;
  text-decoration: underline;
}

.role-selector {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: #2b3036;
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid #3d444d;
  font-size: 11px;
}

.role-selector label {
  color: #a1a1a6;
  font-size: 11px;
}

.role-selector select {
  background: transparent;
  color: #ffffff !important;
  border: none;
  outline: none;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
}

.role-selector select option {
  background-color: #1c1c1e;
  color: #ffffff;
}

.brand-container {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  cursor: pointer;
}

.brand-logo {
  height: 26px;
  width: 26px;
  object-fit: contain;
  filter: invert(1) brightness(2) !important; /* ALWAYS white on the black navbar */
  display: block;
}

.theme-toggle-btn {
  background: #2b3036;
  border: 1px solid #3d444d;
  color: #ffffff !important;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.theme-toggle-btn:hover {
  background: #373e47;
  color: #ffcc00 !important;
  border-color: #ffcc00;
}

.theme-icon {
  display: block;
  fill: currentColor !important;
}

.theme-icon * {
  fill: currentColor !important;
}
</style>
