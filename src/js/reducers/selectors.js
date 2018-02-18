// @flow
import type { IrcState, ConversationT } from '../flow'

export function getConnectionById (state: IrcState, connectionId: string) {
  return state.connections.list.find(({ id }) => id === connectionId)
}

export function getConversationsForConnection (state: IrcState, id: string): Array<ConversationT> {
  if (!state.conversations.list) return []
  // TODO: use id
  const filtered = state.conversations.list.filter(c => c.type !== 'CONNECTION')
  if (filtered) {
    return filtered.toArray()
  } else {
    return []
  }
}
