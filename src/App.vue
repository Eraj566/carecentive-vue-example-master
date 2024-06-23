<script setup>
import { inject } from '@vue/runtime-core'
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'

const AuthenticationService = inject('AuthenticationService')

</script>

<template>
  <header>
    <div class="wrapper">
      <nav v-if="AuthenticationService.isAuthorized()">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/activities">Activities</RouterLink>
        <RouterLink to="/questionnaires/sample-questionnaire">Sample Questionnaire</RouterLink>
        <RouterLink to="/knowledge">Knowledge</RouterLink>
        <RouterLink to="/chat">Chat</RouterLink>
        <RouterLink to="/profile">Profile</RouterLink>
        <RouterLink to="/image-upload">Image upload</RouterLink>
        <RouterLink to="/measurements">Wearable Measurements</RouterLink>
      </nav>
    </div>
  </header>
  <main>
    <RouterView />
  </main>
  
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  width: 100%;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

main {
  display: block;
  width: 100%;
}

@media (min-width: 1024px) {
  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
