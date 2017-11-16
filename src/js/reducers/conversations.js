import { combineReducers } from 'redux'
import {
  REQUEST_CONNECTION,
  RECEIVE_MOTD,
  RECEIVE_NOTICE,
  RECEIVE_WELCOME
} from '../actions'

function list (state = [], { type, payload }) {
  switch (type) {
    case REQUEST_CONNECTION.SUCCESS:
      return state.concat([{
        type: 'CONNECTION',
        name: payload.id,
        messages: [],
        people: []
      }])
    case RECEIVE_MOTD:
      return addMessageToIdInList(state, payload.connectionId, {
        type: 'motd',
        text: payload.motd,
        from: '',
        to: '',
        when: new Date()
      })
    case RECEIVE_NOTICE:
      return addMessageToIdInList(state, payload.connectionId, {
        type: 'notice',
        text: payload.message,
        from: payload.from,
        to: payload.to,
        when: new Date()
      })
    case RECEIVE_WELCOME:
      return addMessageToIdInList(state, payload.connectionId, {
        type: 'welcome',
        text: '',
        from: '',
        to: payload.nick,
        when: new Date()
      })
    default:
      return state
  }
}

function addMessageToIdInList (state, id, message) {
  return updateIdInList(state, id, convo => Object.assign({}, convo, {
    messages: convo.messages.concat([ message ])
  }))
}

function updateIdInList (state, id, update) {
  return state.map(conversation => {
    if (conversation.name === id) {
      return update(conversation)
    } else {
      return conversation
    }
  })
}

export default combineReducers({
  list
})
