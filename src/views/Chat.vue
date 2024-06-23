<script setup>
import { ref } from "@vue/reactivity";
import { inject, onMounted } from "vue";
import axios from "axios";
import Globals from "/src/services/Globals";
import Message from "./Message.vue";
const AuthenticationService = inject("AuthenticationService");

const tickets = ref();
const chatMessages = ref([]);
const title = ref("");
const description = ref("");
const newMessage = ref("");
const role = ref();
const ticketList = ref([]);
const selectedTicket = ref(0);
const group = ref();
const file = ref();
let filePath = null

// console.log(AuthenticationService.userData.user_id, "AuthenticationService")

const { user_id } = AuthenticationService.userData;

// Setup Socket.IO connection
import { io } from "socket.io-client";

const socket = io("http://localhost:3001"); // Replace with your Socket.IO server address

onMounted(async () => {
  try {
    // const userRole = AuthenticationService.getRoles(user_id);
    const rolesResponse = await axios.get(
      Globals.SERVER_URL + `/roles/${user_id}`
    );
    role.value = rolesResponse.data[0]?.id;

    if (role.value == 1) {
      const ticketResponse = await axios.get(
        Globals.SERVER_URL + `/tickets/${user_id}`
      );
      // tickets.value = ticketResponse.data[0];

      getChat(ticketResponse.data[0]?.id, ticketResponse.data[0]);
    } else if (role.value == 2) {
      const ticketListResponse = await axios.get(
        Globals.SERVER_URL + `/tickets/open`
      );
      ticketList.value = ticketListResponse.data;
    } else {
      const groupResponse = await axios.get(
        Globals.SERVER_URL + `/groups/role/${role.value}`
      );

      group.value = groupResponse.data;
      await getChatByGoupId(groupResponse.data?.id);

    }

    socket.on("chatMessage", (message) => {
      if (message.ticket_id && message.ticket_id == selectedTicket.value) {
        
        chatMessages.value.push({
          message: message.message,
          user_id: message.user_id,
          attachment: message.attachment
        });

        if (user_id != message.user_id && tickets.value.status == "open") {
          tickets.value.status == "in-progress"
        }
      }else if(message?.group_id == group.value?.id){
        chatMessages.value.push({
          message: message.message,
          user_id: message.user_id,
          attachment: message.attachment
        });
      }
    });

    // Assuming you have a similar endpoint for chat messages
    // const chatResponse = await axios.get(Globals.SERVER_URL + `/chat/${user_id}`);
    // chatMessages.value = chatResponse.data;
  } catch (error) {
    console.error(error);
  }
});

async function insertTicket() {
  try {
    const response = await axios.post(Globals.SERVER_URL + `/tickets`, {
      id: user_id,
      title: title.value,
      description: description.value,
    });

    tickets.value = {...response, status: "open"};
  } catch (error) {
    console.error(error);
  }
}

async function getChat(id, ticket) {
  try {
    selectedTicket.value = id;
    tickets.value = ticket 
    const response = await axios.get(Globals.SERVER_URL + `/chat/${id}`);
    
    chatMessages.value = response.data;
    // console.log(chatMessages.value,response.data, "chatMessages.value");
  } catch (error) {
    console.error(error);
  }
}

async function getChatByGoupId(id) {
  try {
    const response = await axios.get(Globals.SERVER_URL + `/chat/group/${id}`);
    
    chatMessages.value = response.data;
    // console.log(chatMessages.value,response.data, "chatMessages.value");
  } catch (error) {
    console.error(error);
  }
}

async function sendMessage() {
  if (newMessage !== "") {
    // Emit a chat message event to the server
    try {
      if (role.value > 2) {
        const response = await axios.post(Globals.SERVER_URL + `/chat`, {
          message: newMessage.value,
          user_id,
          ticket_id: 0,
          group_id: group.value.id,
          attachment: null
        });
      } else {
        const response = await axios.post(Globals.SERVER_URL + `/chat`, {
          message: newMessage.value,
          user_id,
          ticket_id: selectedTicket.value,
          group_id: 0,
          attachment: null
        });
      }
    } catch (error) {
      console.error(error);
    }
    socket.emit("chatMessage", {
      user_id: user_id,
      message: newMessage.value,
      ticket_id: selectedTicket.value,
      group_id: role.value > 2 ? group.value.id : 0,
      attachment: null
    });

    // Add the message to the local chatMessages array immediately for a smoother user experience
    chatMessages.value.push({
      message: newMessage.value,
      user_id,
      attachment: null
    });
    console.log(tickets.value, role.value, 'here');
    if (tickets.value?.status == "open") {
      if(role.value == 1){
        const response = await axios.get(Globals.SERVER_URL + `/autoreply/?message=${newMessage.value}`);
        
        if(Object.keys(response.data).length > 0){
          const response2 = await axios.post(Globals.SERVER_URL + `/chat`, {
            message: response.data.reply_message,
            user_id: 3,
            ticket_id: selectedTicket.value,
            group_id: 0,
            attachment: null
          });
          socket.emit("chatMessage", {
            user_id: 3,
            message: response.data.reply_message,
            ticket_id: selectedTicket.value,
            group_id: role.value > 2 ? role.value : 0,
            attachment: null
          });
          chatMessages.value.push({
            message: response.data.reply_message,
            user_id,
            attachment: null
          });
        }
      }else if(role.value == 2){
        await axios.patch(Globals.SERVER_URL + `/tickets/update-status`, {
          id: selectedTicket.value,
          status: "in-progress"
        });
        tickets.value.status = "in-progress";
      }
    }

    newMessage.value = "";
  }
}

async function handleFileUpload(event) {
  // Get the uploaded file
  file.value = event.target.files[0];

  console.log(event.target.files[0], 'here');

  if (Object.keys(event.target.files[0]).length > 0) {
    alert("Please select a file to upload.");
    return;
  }

  const formData = new FormData();
  formData.append('file', event.target.files[0]);

  const fileUpload = await axios.post(Globals.SERVER_URL + `/chat/upload`, formData);

  try {
      if (role.value > 2) {
        const response = await axios.post(Globals.SERVER_URL + `/chat`, {
          message: "",
          user_id,
          ticket_id: 0,
          group_id: group.value.id,
          attachment: fileUpload.data.filePath
        });
      } else {
        const response = await axios.post(Globals.SERVER_URL + `/chat`, {
          message: "",
          user_id,
          ticket_id: selectedTicket.value,
          group_id: 0,
          attachment: fileUpload.data.filePath
        });
      }
    } catch (error) {
      console.error(error);
    }
    socket.emit("chatMessage", {
      user_id: user_id,
      message: "",
      ticket_id: selectedTicket.value,
      group_id: role.value > 2 ? group.value.id : 0,
      attachment: fileUpload.data.filePath
    });

    // Add the message to the local chatMessages array immediately for a smoother user experience
    chatMessages.value.push({
      message: "",
      user_id,
      attachment: fileUpload.data.filePath
    });

}

function uploadAttactment(){
  document.querySelector("input[name=fileInput]").click()
}

</script>

<template>
  <span v-if="role == 1">
    <div v-if="tickets">
      <h1>Chat</h1>
      <div v-for="(message, index) in chatMessages" :key="index">
        <Message :text="message.message" :role="role" :isMine="user_id == message.user_id" :attachment="message.attachment ? message.attachment : ''"/>
      </div>
      <input
        style="width: 80%"
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Type a message..."
      />
      <button @click="sendMessage" style="width: 10%">Send</button>
      <button @click="uploadAttactment" style="width: 10%">Send Attachment</button>
    </div>
    <div v-else>
      <div class="login">
        <h2 style="color: black">Generate a ticket:</h2>
        <input type="text" v-model="title" placeholder="Subject" /><br />
        <input
          type="text"
          v-model="description"
          placeholder="description"
        /><br />
        <button @click="insertTicket">Generate</button>
      </div>
    </div>
  </span>
  <span v-else-if="role == 2">
    <h1>Chat</h1>
    <span style="display: flex">
      <div style="width: 20%">
        <div v-for="(ticket, index) in ticketList" :key="index">
          <p @click="getChat(ticket?.id, ticket)">{{ ticket?.title }}</p>
        </div>
      </div>
      <div style="width: 80%">
        <div v-for="(message, index) in chatMessages" :key="index">
          <Message :text="message.message" :role="role" :isMine="user_id == message.user_id" :attachment="message.attachment ? message.attachment : ''"/>
        </div>
        <input
          style="width: 75%"
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="Type a message..."
        />
        <button @click="sendMessage" style="width: 12.5%">Send</button>
        <button @click="uploadAttactment" style="width: 12.5%">Send Attachment</button>
      </div>
    </span>
  </span>
  <span v-else-if="role == 3">
    <h1>Chat</h1>
    <div v-for="(message, index) in chatMessages" :key="index">
      <Message :text="message.message" :role="role" :isMine="user_id == message.user_id" :attachment="message.attachment ? message.attachment : ''"/>
    </div>
    <input
      style="width: 80%"
      v-model="newMessage"
      @keyup.enter="sendMessage"
      placeholder="Type a message..."
    />
    <button @click="sendMessage" style="width: 10%">Send</button>
    <button @click="uploadAttactment" style="width: 10%">Send Attachment</button>
  </span>
  <input name="fileInput" type="file" style="display: none" @change="handleFileUpload">
</template>
<style></style>
