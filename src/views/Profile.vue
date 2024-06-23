<script setup>
  import axios from 'axios';
  import Globals from '/src/services/Globals';
  import { inject, ref } from 'vue'

  const colorSchema = ref("")
  const newPassword = ref("")

  axios.get(Globals.SERVER_URL + "/settings/colorSchema").then(function(res){
    colorSchema.value = res.data;
  }).catch(function(err){
    console.log(err);
  });

  function saveColor() {
    console.log("test");
    axios.post(Globals.SERVER_URL + "/settings", {
      key: "colorSchema",
      data: colorSchema.value
    }).then(function(res) {
      alert("Saved!");
    }).catch(function(err) {
      console.log(err);
    });
  }

  function updatePassword() {
    axios.post(Globals.SERVER_URL + "/users/changePassword", {
      newPassword: newPassword.value,
    }).then(function(res){
      alert("Password changed!")
    }).catch(function(err){
      console.log(err);
    });
  }
</script>

<template>
  <div>
    <h1>Profile</h1>
    <p>Go for a change!</p>
    <h2>Color Schema</h2>
    Your color schema is: {{ colorSchema }}
    <div>
      <input type="radio" id="green" value="Green" v-model="colorSchema" @change="saveColor()" />
      <label for="green">Greeen</label><br/>
      <input type="radio" id="blue" value="Blue" v-model="colorSchema" @change="saveColor()" />
      <label for="blue">Blue</label><br/>
      <input type="radio" id="red" value="Red" v-model="colorSchema" @change="saveColor()" />
      <label for="red">Red</label><br/>
    </div>  
    <h2>Password</h2>
    <p>Enter a new password below to change it.</p>
    <div>
      <input type="password" v-model="newPassword" />
      <button @click="updatePassword()">Change password</button>
    </div>

  </div>
  
</template>

<style>
  input[type="radio"] {
    margin-right: 0.5em;
  }
</style>
