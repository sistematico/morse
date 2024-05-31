import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('*', cors())

app.get('/', (c) => {
  return c.text('Morse API')
})

const server = Bun.serve<{ socketId: number }>({
  fetch(req, server) {
    if (server.upgrade(req, { data: { socketId: Math.random() } })) {
      return
    }
    return app.fetch(req)
  },
  websocket: {
    open(ws) {
      const socketId = Math.random()
      ws.data = { socketId } // Inicializa ws.data
      //addClient(socketId, ws)
      console.log(`WebSocket connection opened: ${socketId}`)
    },
    message(ws, message) {
      console.log(`Received ${message} from ${ws.data.socketId}`)
      //broadcastMessage(String(message))
    },
    close(ws) {
      //removeClient(ws.data.socketId)
      console.log(`WebSocket connection closed: ${ws.data.socketId}`)
    }
  },
  port: 4010
})

console.log(`Server running at http://localhost:${server.port}`)