import { combineReducers } from 'redux'
import {
  RECEIVE_CHANNEL_MESSAGE,
  REQUEST_CONNECTION,
  RECEIVE_DIRECT_MESSAGE,
  RECEIVE_JOIN,
  RECEIVE_MOTD,
  RECEIVE_NAMES,
  RECEIVE_NOTICE,
  RECEIVE_PART,
  RECEIVE_QUIT,
  RECEIVE_TOPIC,
  RECEIVE_WELCOME,
  COMMAND
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
      return addMessageToIdInList(
        state,
        payload.to === '*' ? payload.connectionId : payload.to,
        {
          type: 'notice',
          text: payload.message,
          from: payload.from,
          to: payload.to,
          when: new Date()
        }
      )
    case RECEIVE_WELCOME:
      return addMessageToIdInList(state, payload.connectionId, {
        type: 'welcome',
        text: '',
        from: '',
        to: payload.nick,
        when: new Date()
      })
    case RECEIVE_DIRECT_MESSAGE:
      return addMessageToIdInList(state, payload.from, {
        type: 'priv',
        text: payload.message,
        from: payload.from,
        to: '',
        when: new Date()
      })
    case RECEIVE_CHANNEL_MESSAGE:
      return addMessageToIdInList(state, payload.channel, {
        type: 'priv',
        text: payload.message,
        from: payload.from,
        to: payload.channel,
        when: new Date()
      })
    case COMMAND.join:
      return state.concat([{
        type: 'CHANNEL',
        name: payload.name,
        messages: [],
        people: []
      }])
    case RECEIVE_NAMES:
      return updateIdInList(state, payload.channel, convo => Object.assign({}, convo, {
        people: payload.names
      }))
    case RECEIVE_JOIN:
      return addMessageToIdInList(state, payload.channel, {
        type: 'join',
        text: '',
        from: payload.from,
        to: payload.channel,
        when: new Date()
      })
    case RECEIVE_QUIT:
      return addMessageToIdInList(state, payload.channel, {
        type: 'quit',
        text: payload.message,
        from: payload.nick,
        to: payload.channel,
        when: new Date()
      })
    case RECEIVE_PART:
      return addMessageToIdInList(state, payload.nick, {
        type: 'part',
        text: payload.message,
        from: payload.nick,
        to: '',
        when: new Date()
      })
    case RECEIVE_TOPIC:
      return addMessageToIdInList(state, payload.channel, {
        type: 'topic',
        text: payload.topic,
        from: payload.channel,
        to: payload.channel,
        when: new Date()
      })
    // case RECEIVE_NICK:
    // case RECEIVE_AWAY:
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
  let foundOne = false

  const result = state.map(conversation => {
    if (conversation.name === id) {
      foundOne = true
      return update(conversation)
    } else {
      return conversation
    }
  })

  if (foundOne) {
    return result
  } else {
    return result.concat([update({
      type: 'DIRECT',
      name: id,
      messages: [],
      people: []
    })])
  }
}

export default combineReducers({
  list
})
