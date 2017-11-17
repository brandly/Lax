// @flow
import type { IrcState } from '../flow'

export function getConnectionById (state: IrcState, connectionId: string) {
  return state.connections.list.find(({ id }) => id === connectionId)
}

export function getConversationByName (state: IrcState, conversationId: string) {
  return state.conversations.list.find(({ name }) => name === conversationId)
}

export function getConversationsForConnection (state: IrcState, id: string) {
  // TODO:
  return state.conversations.list.filter(c => ['DIRECT', 'CHANNEL'].includes(c.type))
}
