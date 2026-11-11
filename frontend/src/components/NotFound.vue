<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="not-found-page">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>The page you are looking for does not exist or has been moved.</p>
    <RouterLink to="/schedule" class="home-btn">Go to Timetable</RouterLink>
  </div>
</template>

<style scoped>
.not-found-page {
  text-align: center;
  padding: 4rem 1rem;
}
h1 {
  font-size: 4rem;
  color: #ef4444;
  margin: 0;
}
h2 {
  font-size: 1.5rem;
  margin: 0.5rem 0 1rem;
}
p {
  color: #64748b;
  margin-bottom: 1.5rem;
}
.home-btn {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background: #2563eb;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
}
</style>