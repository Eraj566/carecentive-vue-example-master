<!-- Message.vue -->
<template>
  <span v-if="attachment">
    <div v-if="isMine" style="text-align: right">
      Attachment:
      <button @click="downloadFile">Download</button>
    </div>
    <div v-else>
      Attachment:

      <button @click="downloadFile">Download</button>
    </div>
  </span>
  <span v-else>
    <div v-if="isMine" style="text-align: right">{{ text }}</div>
    <div v-else>{{ text }}</div>
  </span>
</template>

<script>
export default {
  props: {
    text: String,
    role: Number,
    isMine: Boolean,
    attachment: String,
  },
  computed: {
    returnLink() {
      return `http://localhost:3001${this.attachment}`;
    },
  },
  methods: {
    downloadFile() {
      // Replace 'your_file_url' with the URL of your file
      const fileUrl = `http://localhost:3001${this.attachment}`;
      const fileName = this.attachment.split("/");

      // Create a new XMLHttpRequest
      const xhr = new XMLHttpRequest();
      xhr.open('GET', fileUrl, true);
      xhr.responseType = 'blob'; // Set the response type to blob

      // When the request is loaded
      xhr.onload = function () {
        if (this.status === 200) {
          // Create a blob object from the response
          const blob = new Blob([xhr.response], { type: xhr.getResponseHeader('Content-Type') });

          // Create a temporary URL for the blob
          const url = window.URL.createObjectURL(blob);

          // Create a new anchor element
          const link = document.createElement('a');
          link.href = url;

          

          // Specify the filename for the download
          link.setAttribute("download", fileName[fileName.length - 1]); 

          // Append the anchor element to the body
          document.body.appendChild(link);

          // Trigger a click event on the anchor element
          link.click();

          // Clean up: remove the anchor element and revoke the temporary URL
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }
      };

      // Send the request
      xhr.send();
    },
  },
  // ... other component options
};
//{{ role == 1 && isMine ? "You" : role == 1 && !isMine ? "Doctor" : role == 2 && !isMine ? "Patient" : "Doctor" }}
</script>
