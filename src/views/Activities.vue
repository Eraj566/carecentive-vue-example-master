<script setup>
  import { ref } from '@vue/reactivity';
  import axios from 'axios';
  import Globals from '/src/services/Globals';

  const activities = ref({activities: []});

  axios.get(Globals.SERVER_URL + "/activities").then(function(res){
    console.log(activities);
    activities.value = res.data;
  }).catch(function(err){
    console.log(err);
  });
</script>

<template>
  <div>
    <h1>Activities</h1>
    <p>Please perform the following activities:</p>
    <ul>
      <li v-for="(item, index) in activities.activities">
        {{ index }}
      </li>
    </ul>
  </div>
  
</template>

<style>
</style>
