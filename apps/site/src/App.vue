<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const url = import.meta.env.VITE_WS_URL as string
const messages = ref<string[]>([])
const message = ref<string>('')
let socket: WebSocket

const sendMessage = () => {
  if (message.value && socket.readyState === WebSocket.OPEN) socket.send(message.value)
  message.value = ''
}

onMounted(() => {
  socket = new WebSocket(url)

  socket.addEventListener('message', (event) => {
    messages.value.push(event.data)
  })
})

onBeforeUnmount(() => {
  socket.close()
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full text-white">
    <div>
      <a href="https://vuejs.org/" target="_blank">
        <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>
    <div class="chat-container flex flex-col h-full w-full p-4">
      <div class="messages flex-1 overflow-y-auto border-4 border-indigo-500 p-4 mb-4 bg-[#242424] rounded-lg">
        <div v-for="(message, index) in messages" :key="index" class="message mb-2 p-2 border-4 border-indigo-500 rounded-lg">
          {{ message }}
        </div>
      </div>
      <div class="flex">
        <input
          v-model="message"
          @keyup.enter="sendMessage"
          placeholder="Type a message..."
          class="flex-1 p-2 border border-gray-600 bg-gray-700 rounded-lg mr-2 text-white outline-none outline-none:hover"
        />
        <button @click="sendMessage" class="p-2 bg-blue-600 text-white rounded-lg">Send</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
  height: 100%;
  width: 100%;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 10px;
}

.message {
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 5px;
}
</style>