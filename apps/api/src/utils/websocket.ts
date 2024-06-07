import type { ServerWebSocket } from 'bun'

const clients = new Map<number, ServerWebSocket<{ socketId: number }>>()

export const addClient = (id: number, socket: ServerWebSocket<{ socketId: number }>) => {
  clients.set(id, socket)
}

export const removeClient = (id: number) => {
  clients.delete(id)
}

export function broadcastMessage(user: string, message: string) {
  for (const client of clients.values()) {
    console.log(`Broadcasting message: ${message} from ${user}`)
    client.send(JSON.stringify({ user, message }))
  }
}