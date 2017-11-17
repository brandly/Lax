// @flow
import { combineReducers } from 'redux'
import {
  REQUEST_CONNECTION,
  RECEIVE_WELCOME
} from '../actions'

function list (state = [], { type, payload }) {
  switch (type) {
    case REQUEST_CONNECTION.PENDING:
      return updateIdInList(state, payload.id, payload)
    case REQUEST_CONNECTION.SUCCESS:
      return updateIdInList(state, payload.id, {
        isConnected: true
      })
    case REQUEST_CONNECTION.ERROR:
      return updateIdInList(state, payload.id, {
        error: payload.error
      })
    case RECEIVE_WELCOME:
      return updateIdInList(state, payload.connectionId, {
        isWelcome: true
      })
    default:
      return state
  }
}

function updateIdInList (state, id, update) {
  let found = false
  const result = state.map(connection => {
    if (connection.id === id) {
      found = true
      return Object.assign({}, connection, update)
    } else {
      return connection
    }
  })

  return found ? result : result.concat([ update ])
}

export default combineReducers({
  list
})
