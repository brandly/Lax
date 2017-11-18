// @flow
/* global $Shape */
import { combineReducers } from 'redux'
import {
  REQUEST_CONNECTION,
  RECEIVE_WELCOME
} from '../actions'
import type { ConnectionT } from '../flow'

function list (state : Array<ConnectionT> = [], { type, payload }) : Array<ConnectionT> {
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

function updateIdInList (
  state : Array<ConnectionT>,
  id : string,
  update : $Shape<ConnectionT>
) : Array<ConnectionT> {
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
