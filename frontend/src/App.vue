<template>
  <div>
    <h1>Routes</h1>
    <nav>
      <router-link to="/"></router-link> | 
      <router-link to="/schedule">Schedule</router-link> | 
      <router-link to="/login">Login</router-link> | 
      <router-link to="/sessions">Sessions</router-link> | 
      <router-link to="/rooms">Rooms</router-link> | 
      <router-link to="/admin">Admin</router-link> 
    </nav>
    <router-view />
  </div>
  
</template>

<script>
export default{
  name: 'app'
}
</script>

