// @flow
import { combineReducers } from 'redux'
import {
  RECEIVE_CHANNEL_MESSAGE,
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
  MessageT,
  PersonT,
  Action
} from '../flow'

function list (
  state : Array<ConversationT> = [],
  action : Action
) : Array<ConversationT> {
  switch (action.type) {
    case 'REQUEST_CONNECTION_SUCCESS':
      return state.concat([{
        type: 'CONNECTION',
        name: action.connectionId,
        messages: [],
        people: []
      }])
    case RECEIVE_MOTD:
      return addMessageToIdInList(state, action.connectionId, {
        type: 'motd',
        text: action.motd,
        from: '',
        to: '',
        when: new Date()
      })
    case RECEIVE_NOTICE:
      return addMessageToIdInList(
        state,
        action.to === '*' ? action.connectionId : action.to,
        {
          type: 'notice',
          text: action.message,
          from: action.from,
          to: action.to,
          when: new Date()
        }
      )
    case RECEIVE_WELCOME:
      return addMessageToIdInList(state, action.connectionId, {
        type: 'welcome',
        text: '',
        from: '',
        to: action.nick,
        when: new Date()
      })
    case 'SEND_MESSAGE':
      return addMessageToIdInList(state, action.to, {
        type: 'priv',
        text: action.message,
        from: action.from,
        to: action.to,
        when: new Date()
      })
    case RECEIVE_DIRECT_MESSAGE:
      return addMessageToIdInList(state, action.from, {
        type: 'priv',
        text: action.message,
        from: action.from,
        to: '',
        when: new Date()
      })
    case RECEIVE_CHANNEL_MESSAGE:
      return addMessageToIdInList(state, action.channel, {
        type: 'priv',
        text: action.message,
        from: action.from,
        to: action.channel,
        when: new Date()
      })
    case COMMAND.join:
      return state.concat([{
        type: 'CHANNEL',
        name: action.name,
        messages: [],
        people: []
      }])
    case RECEIVE_NAMES: {
      const { names } = action
      return updateIdInList(state, action.channel, convo => Object.assign({}, convo, {
        people: names
      }))
    }
    case RECEIVE_JOIN: {
      const { channel, from } = action
      return updateIdInList(state, channel, convo => Object.assign({}, convo, {
        people: convo.people.concat({
          name: from,
          mode: ''
        }),
        messages: convo.messages.concat({
          type: 'join',
          text: '',
          from: from,
          to: channel,
          when: new Date()
        })
      }))
    }
    case RECEIVE_QUIT: {
      // TODO: flow isn't happy unless i pull these off early, hmmmm
      const { nick, message } = action
      return applyToConversationsWhere(
        state,
        convo => convo.people.map((p : PersonT) : string => p.name).includes(nick),
        convo => Object.assign({}, convo, {
          people: convo.people.filter(person => person.name !== nick),
          messages: convo.messages.concat([{
            type: 'quit',
            text: message,
            from: nick,
            to: '',
            when: new Date()
          }])
        })
      )
    }
    case RECEIVE_PART:
      return addMessageToIdInList(state, action.nick, {
        type: 'part',
        text: action.message,
        from: action.nick,
        to: '',
        when: new Date()
      })
    case RECEIVE_TOPIC:
      return addMessageToIdInList(state, action.channel, {
        type: 'topic',
        text: action.topic,
        from: action.channel,
        to: action.channel,
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
) : Array<ConversationT> {
  return list.map(item =>
    predicate(item) ? update(item) : item
  )
}

export default combineReducers({
  list
})
