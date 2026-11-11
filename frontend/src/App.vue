<template>
  <div id="app-layout">
    <TheNavBar />
    <main class="app-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import TheNavBar from '@/components/TheNavBar.vue'
</script>

<style scoped>
#app-layout {
  height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden; 
}

.app-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}
</style>
