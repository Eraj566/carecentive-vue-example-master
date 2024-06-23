<script setup>
  import axios from 'axios';
  import Globals from '/src/services/Globals';
  import { inject, ref } from 'vue'

  function uploadFile(event) {
    console.log(event);
      const fd = new FormData();
      fd.append("data", event.target.files[0]);
      fd.append("type", "photo");

      axios.post(Globals.SERVER_URL + "/files", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        alert("Upload successful!");
      }).catch((err) =>{
        console.log(err);
        alert("Error!");
      });
  }
</script>

<template>
  <div>
    <h1>Image upload</h1>
    <p>Please take a photo of your medical records:</p>
    <label class="custom-file-upload">
      <input type="file" accept="image/*" capture="camera" @change="uploadFile" hidden />
      Take image!
    </label>
  </div>
</template>

<style>
label.custom-file-upload {
  margin-top: 1em;
  border-radius: 10px;
  padding: 1em;
  background: #f0f0f0;
  display: inline-block;
}
  input[type="file"] {
      display: none;
  }
</style>
