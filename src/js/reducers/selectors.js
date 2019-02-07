// @flow
import type { IrcState, ConnectionT, ConversationT, RouteT } from '../flow'

export function getConnectionById(
  state: IrcState,
  connectionId: string
): ?ConnectionT {
  return state.connections.list.find(({ id }) => id === connectionId)
}

export function getConversationsForConnection(
  state: IrcState,
  id: string
): Array<ConversationT> {
  const connection = getConnectionById(state, id)
  if (!connection || !connection.conversations) return []
  return connection.conversations.toArray().filter(c => c.type !== 'CONNECTION')
}

export function getSelectedConversation(
  state: IrcState,
  id: string
): ?ConversationT {
  const connection = getConnectionById(state, id)
  if (!connection || !connection.conversations) return null
  return connection.conversations.getSelected()
}
