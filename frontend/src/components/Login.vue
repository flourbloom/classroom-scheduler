<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Role } from '@/types'
import logoUrl from '../assets/logo.png'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref<string | null>(null)

function handleLogin() {
  errorMessage.value = null
  if (!email.value || !password.value) {
    errorMessage.value = 'Email or password is required.'
    return
  }

  // dummy incase api not running
  if (email.value === 'admin@example.com') {
    authStore.setSession(
      {
        id: '4',
        name: 'admin',
        email: email.value,
        password: '',
        role: Role.Admin,
      },
      'token-admin'
    )
    router.push('/admin')
  } else if(email.value.match("teacher")) {
    authStore.setSession(
      {
        id: '1',
        name: 'teacher1',
        email: email.value,
        password: '',
        role: Role.Teacher,
      },
      'token-teacher'
    )
    router.push('/schedule')
  }
}
</script>

<template>
  <!-- Figma node 3:23104 "Login — Invalid credentials" -->
  <div class="sign-in-area">
    <div class="sign-in-panel">
      <div class="auth-brand">
        <div class="brand-mark">
          <img :src="logoUrl" alt="ClassroomHub Logo" class="brand-logo" />
        </div>
        <span class="auth-brand-name">ClassroomHub</span>
      </div>
      <h2 class="sign-in-title">Sign in</h2>
      <p class="sign-in-desc">Use the account your department admin created.</p>

      <form class="sign-in-form" @submit.prevent="handleLogin">
        <div class="form-field">
          <label for="email-input">Email</label>
          <div class="input-container">
            <input
              id="email-input"
              v-model="email"
              type="email"
              placeholder="name@university.edu"
            />
          </div>
        </div>

        <div class="form-field">
          <label for="password-input">Password</label>
          <div class="input-container">
            <input
              id="password-input"
              v-model="password"
              type="password"
              placeholder="••••••••"
            />
          </div>
        </div>

        <!-- Figma Error message box (node 3:23119) -->
        <div v-if="errorMessage" class="error-message-box">
          <p>{{ errorMessage }}</p>
        </div>

        <div class="submit-action">
          <button type="submit" class="btn-primary full-width">
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.sign-in-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
  width: 100%;
  flex: 1;
  background-color: var(--color-canvas-parchment);
}

/* utility card */
.sign-in-panel {
  background-color: var(--color-card-bg);
  border: 1px solid var(--color-iron);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  padding: 24px;
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.auth-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 6px;
}

.auth-brand-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-shark);
}

.sign-in-title {
  font-size: 16.4px;
  font-weight: 700;
  line-height: 1.4;
  color: var(--color-shark);
  margin: 0;
  white-space: nowrap;
}

.sign-in-desc {
  font-size: 14px;
  font-weight: 400;
  line-height: 19.6px;
  color: var(--color-text-secondary);
  margin: 0;
}

.sign-in-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
}

.form-field label {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  color: var(--color-text-secondary);
  margin: 0;
}

.input-container {
  background-color: var(--color-white);
  border: 1px solid var(--color-iron);
  border-radius: 2px;
  min-height: 33px;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  width: 100%;
}

.input-container input {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  line-height: 19.6px;
  color: var(--color-shark);
  padding: 0;
  margin: 0;
}

/* Figma node 3:23119 */
.error-message-box {
  border: 1px solid #b3261e;
  border-radius: 2px;
  padding: 6px 8px;
  width: 100%;
}

.error-message-box p {
  font-size: 12px;
  line-height: 1.4;
  color: #b3261e;
  margin: 0;
}

.submit-action {
  padding-top: 4px;
  width: 100%;
}

.btn-primary {
  background-color: var(--color-lochmara);
  border: 1px solid var(--color-lochmara);
  border-radius: 2px;
  padding: 6px 12px;
  min-height: 33px;
  width: 100%;
  color: var(--color-white);
  font-size: 14px;
  line-height: 19.6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s;
}

.btn-primary:hover {
  background-color: var(--color-lochmara-hover);
  border-color: var(--color-lochmara-hover);
}

.btn-primary.full-width {
  width: 100%;
}
</style>
