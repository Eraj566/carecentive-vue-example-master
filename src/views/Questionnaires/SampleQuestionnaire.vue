<script setup>
  import { reactive } from 'vue';
  import axios from 'axios';
  import Globals from '/src/services/Globals';

  const state = reactive({age: "", symptoms: "", allergies: ""});

  function submitQuestionnaire() {
    axios.post(Globals.SERVER_URL + "/questionnaires", {
      questionnaireName: "sample-questionnaire",
      questionnaireData: state,
    }).then(function(res){
      alert("Questionnaire submitted!");
    }).catch(function(err){
      console.log(err);
    });
  }
</script>

<template>
  <div>
    <h1>Sample Questionnaire</h1>
    <div>
      <label for="age">How old are you?</label><br/>
      <input type="number" id="age" v-model="state.age" />
    </div>
    <div>
      <label for="symptoms">Any symptoms?</label><br/>
      <input type="text" id="symptoms" v-model="state.symptoms" />
    </div>
    <div>
      <label for="allergies">Any allergies?</label><br/>
      <input type="text" id="allergies" v-model="state.allergies" />
    </div>
    <button @click="submitQuestionnaire()">Submit</button>
  </div>
</template>

<style>
</style>
