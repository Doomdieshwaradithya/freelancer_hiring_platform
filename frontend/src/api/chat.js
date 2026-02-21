import api from './client.js'

export const getConversations = () => api.get('/chat')

export const getConversation = (userId) => api.get(`/chat/${userId}`)

export const sendMessage = (receiverId, message) =>
  api.post('/chat', { receiverId, message })
