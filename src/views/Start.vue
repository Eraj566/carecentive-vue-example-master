<script setup>
import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter();
const AuthenticationService = inject('AuthenticationService')

const username = ref("")
const password = ref("")
const email = ref("")

async function login() {
  AuthenticationService.login(username.value, password.value).then(function(){
    // The statement below is required to forcefully update isAuthorized state
    // to refresh view after successful login
    let update = AuthenticationService.isAuthorized();
  });
}

async function register() {
  AuthenticationService.register(username.value, email.value, password.value).then(function(){
    console.log("succcess");
  });

}
</script>

<template>
  <div v-if="!AuthenticationService.isAuthorized()">
    <h1>Please login or register!</h1>
    <div class="col">
      <div class="login">
        <h2>Login</h2>
        <input type="text" v-model="username" placeholder="Name" /><br/>
        <input type="password" v-model="password" placeholder="Password" /><br/>
        <button @click="login">Login</button>
      </div>
      <div class="register">
        <h2>Register</h2>
        <input type="text" v-model="username" placeholder="Name" /><br/>
        <input type="text" v-model="email" placeholder="Email" /><br/>
        <input type="password" v-model="password" placeholder="Password" /><br/>
        <button @click="register">Register</button>
      </div>
    </div>
  </div>
  <div v-else>
    <h2>You are logged in!</h2>
    Please select a functionality from the menu above.
  </div>
</template>

<style>
.col {
  display: flex;
}

.login, .register {
  padding: 1em;
  margin: 1em;
  background-color: #f3f3f3;
}
</style>
