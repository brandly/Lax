// @flow
import type { IrcState, ConversationT } from '../flow'

export function getConnectionById (state: IrcState, connectionId: string) {
  return state.connections.list.find(({ id }) => id === connectionId)
}

export function getConversationByName (state: IrcState, conversationId: string): ?ConversationT {
  return state.conversations.list.find(({ name }) => name === conversationId)
}

export function getConversationsForConnection (state: IrcState, id: string): Array<ConversationT> {
  // TODO: use id
  return state.conversations.list.filter(c => c.type !== 'CONNECTION')
}
