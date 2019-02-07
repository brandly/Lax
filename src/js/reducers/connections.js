// @flow
/* global $Shape */
import { combineReducers } from 'redux'
import conversationsList from './conversations'
import type { ConnectionT, Action } from '../flow'

function list(
  state: Array<ConnectionT> = [],
  action: Action
): Array<ConnectionT> {
  switch (action.type) {
    case 'REQUEST_CONNECTION_SUCCESS':
      return updateIdInList(state, action.connection.id, action.connection)
    case 'CONNECTION_CLOSED':
      // TODO: only update if it's already in the list
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
  return state.map(connection => {
    if (
      action.type === 'NOTIFICATION_CLICK' ||
      (typeof action.connectionId === 'string' &&
        connection.id === action.connectionId) ||
      (action.connection &&
        typeof action.connection.id === 'string' &&
        connection.id === action.connection.id)
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
  update: $Shape<ConnectionT>
): Array<ConnectionT> {
  let found = false
  const result = state.map(connection => {
    if (connection.id === id) {
      found = true
      return Object.assign({}, connection, update)
    } else {
      return connection
    }
  })

  return found ? result : result.concat([update])
}

const compose = (a, b) => (state, action) => b(a(state, action), action)

export default combineReducers({
  list: compose(
    list,
    withConversations
  )
})
