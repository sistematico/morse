<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { user } from './store.ts'

interface Message {
  user: string
  message: string
}

const url = import.meta.env.VITE_WS_URL as string
const username = ref('')
const messages = ref<Message[]>([])
const message = ref('')
let socket: WebSocket

const sendMessage = () => {
  if (message.value && socket.readyState === WebSocket.OPEN) {
    const data = { user: user.name, message: message.value }
    socket.send(JSON.stringify(data))
  }

  message.value = ''
}

onMounted(() => {
  socket = new WebSocket(url)

  socket.addEventListener('message', (event) => {
    console.log(`Event ${event.data}`)
    const data = JSON.parse(event.data)
    messages.value.push(data)
  })
})

onBeforeUnmount(() => {
  socket.close()
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen text-white">
    <div class="w-full max-w-3xl">
      <div class="flex items-center justify-center">
        <a href="/" target="_blank">
          <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
        </a>
      </div>
      <div class="chat-container flex flex-col h-full w-full p-4" v-if="user.name === ''">
        <div>
          <input
            v-model="username"
            @keyup.enter="sendMessage"
            placeholder="Username"
            class="min-w-2 p-2 border-4 border-indigo-500 bg-zinc-800 rounded-lg me-2 text-white outline-none"
          />
          <button @click="user.name = username" class="flex-none p-2 bg-indigo-500 text-white rounded-lg">OK</button>      
        </div>
      </div>
      <div class="chat-container flex flex-col h-full w-full p-4" v-else>
        <div class="messages flex-1 overflow-y-auto border-4 border-indigo-500 p-4 mb-4 bg-[#242424] rounded-lg">
          <template v-for="data in messages">
            <div class="message mb-2 p-2 border-4 border-indigo-500 rounded-lg" :class="{ 'bg-zinc-900': data.user === user.name }">
              {{ data.user }} - {{ data.message }}
            </div>
          </template>
        </div>
        <div class="flex">
          <input
            v-model="message"
            @keyup.enter="sendMessage"
            placeholder="Type a message..."
            class="flex-grow min-w-2 p-2 border-4 border-indigo-500 bg-zinc-800 rounded-lg me-2 text-white outline-none"
          />
          <button @click="sendMessage" class="flex-none p-2 bg-indigo-500 text-white rounded-lg">Send</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 12em); /* Ajuste a altura conforme necessário */
  width: 100%;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.message {
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 5px;
}
</style>
