import { combineReducers, compose } from 'redux'
import conversationsList from './conversations'
import type { ConnectionT, Action } from '../flow'

function list(
  state: Array<ConnectionT> = [],
  action: Action
): Array<ConnectionT> {
  switch (action.type) {
    case 'REQUEST_CONNECTION_SUCCESS':
      return state.concat([action.connection])

    case 'CONNECTION_CLOSED':
      return updateIdInList(state, action.connectionId, {
        isConnected: false
      })

    case 'RECEIVE_WELCOME':
      return updateIdInList(state, action.connectionId, {
        isWelcome: true
      })

    default:
      return state
  }
}

function withConversations(
  state: Array<ConnectionT> = [],
  action: Action
): Array<ConnectionT> {
  return state.map((connection) => {
    if (
      action.type === 'NOTIFICATION_CLICK' ||
      ('connectionId' in action && connection.id === action.connectionId) ||
      ('connection' in action && connection.id === action.connection.id)
    ) {
      return Object.assign({}, connection, {
        conversations: conversationsList(connection.conversations, action)
      })
    } else {
      return connection
    }
  })
}

function updateIdInList(
  state: Array<ConnectionT>,
  id: string,
  update: Partial<ConnectionT>
): Array<ConnectionT> {
  return state.map((connection) => {
    if (connection.id === id) {
      return Object.assign({}, connection, update)
    } else {
      return connection
    }
  })
}

export default combineReducers({
  list: compose(list, withConversations)
})
