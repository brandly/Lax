export function getConnectionById (state, connectionId) {
  return state.connections.list.find(({ id }) => id === connectionId)
}

export function getConversationByName (state, conversationId) {
  return state.conversations.list.find(({ name }) => name === conversationId)
}

export function getConversationsForConnection (state, id) {
  // TODO:
  return state.conversations.list.filter(c => ['DIRECT', 'CHANNEL'].includes(c.type))
}
