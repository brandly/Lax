// @flow
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
import type {
  ConversationT,
  MessageT
} from '../flow'

function list (state : Array<ConversationT> = [], { type, payload }) : Array<ConversationT> {
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
      return updateIdInList(state, payload.channel, convo => Object.assign({}, convo, {
        people: convo.people.concat({
          name: payload.from,
          mode: '' // TODO: ensure this structure is correct
        }),
        messages: convo.messages.concat({
          type: 'join',
          text: '',
          from: payload.from,
          to: payload.channel,
          when: new Date()
        })
      }))
    case RECEIVE_QUIT:
      return applyToConversationsWhere(
        state,
        convo => convo.people.map(p => p.name).includes(payload.nick),
        convo => Object.assign({}, convo, {
          people: convo.people.filter(person => person.name !== payload.nick),
          messages: convo.messages.concat([{
            type: 'quit',
            text: payload.message,
            from: payload.nick,
            to: '',
            when: new Date()
          }])
        })
      )
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

function addMessageToIdInList (
  state : Array<ConversationT>,
  id : string,
  message : MessageT
) : Array<ConversationT> {
  return updateIdInList(
    state,
    id,
    (convo : ConversationT) : ConversationT => Object.assign({}, convo, {
      messages: convo.messages.concat([ message ])
    })
  )
}

function updateIdInList (
  state : Array<ConversationT>,
  id : string,
  update : ConversationT => ConversationT
) : Array<ConversationT> {
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

function applyToConversationsWhere (
  list : Array<ConversationT>,
  predicate : ConversationT => boolean,
  update : ConversationT => ConversationT
) {
  return list.map(item =>
    predicate(item) ? update(item) : item
  )
}

export default combineReducers({
  list
})
