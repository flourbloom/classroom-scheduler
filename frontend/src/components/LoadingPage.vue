<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    message?: string
  }>(),
  {
    title: 'Loading...',
    message: 'Pulling latest data from database, please wait...'
  }
)
</script>

<template>
  <div class="loading-page">
    <div class="spinner-container">
      <div class="spinner"></div>
    </div>
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
.loading-page {
  text-align: center;
  padding: 4rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 280px;
}

.spinner-container {
  margin-bottom: 1.25rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.9s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

h2 {
  font-size: 1.5rem;
  margin: 0.5rem 0 0.5rem;
  color: var(--color-shark, #1e293b);
  font-weight: 600;
}

p {
  color: #64748b;
  margin: 0;
  font-size: 0.95rem;
}
</style>

