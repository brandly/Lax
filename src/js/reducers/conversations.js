// @flow
import { combineReducers } from 'redux'
import SelectList from '../modules/SelectList'
import type {
  ConversationT,
  MessageT,
  Action
} from '../flow'

function list (
  state: ?SelectList<ConversationT> = null,
  action: Action
): ?SelectList<ConversationT> {
  if (action.type === 'REQUEST_CONNECTION_SUCCESS') {
    const add = {
      type: 'CONNECTION',
      name: action.connectionId,
      messages: [],
      people: [],
      receivedJoin: true,
      unreadCount: 0
    }
    return state ? state.concat([]) : SelectList.fromElement(add)
  } else if (!state) {
    return null
  } else {
    return guaranteedList(state, action).applyToSelected(convo => Object.assign({}, convo, {
      unreadCount: 0
    }))
  }
}

function guaranteedList (
  state: SelectList<ConversationT>,
  action: Action
): SelectList<ConversationT> {
  switch (action.type) {
    case 'RECEIVE_MOTD':
      return addMessageToIdInList(state, action.connectionId, {
        type: 'motd',
        text: action.motd,
        from: '',
        to: '',
        when: new Date()
      })
    case 'RECEIVE_NOTICE':
      return addMessageToIdInList(
        state,
        action.to === '*' ? action.connectionId : action.from,
        {
          type: 'notice',
          text: action.message,
          from: action.from,
          to: action.to,
          when: new Date()
        }
      )
    case 'RECEIVE_WELCOME':
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
    case 'RECEIVE_DIRECT_MESSAGE':
      return incrementUnreadCount(action.from,
        addMessageToIdInList(state, action.from, {
          type: 'priv',
          text: action.message,
          from: action.from,
          to: '',
          when: new Date()
        })
      )
    case 'RECEIVE_CHANNEL_MESSAGE':
      return incrementUnreadCount(action.channel,
        addMessageToIdInList(state, action.channel, {
          type: 'priv',
          text: action.message,
          from: action.from,
          to: action.channel,
          when: new Date()
        })
      )
    case 'COMMAND_JOIN':
      return state.concat([{
        type: 'CHANNEL',
        name: action.name,
        messages: [],
        people: [],
        receivedJoin: false,
        unreadCount: 0
      }])
    case 'RECEIVE_NAMES': {
      const { names, channel } = action
      return updateIdInList(state, channel, convo => Object.assign({}, convo, {
        people: names
      })).selectWhere(convo => convo.name === channel)
    }
    case 'RECEIVE_JOIN': {
      const { channel, from } = action
      return updateIdInList(state, channel, convo => Object.assign({}, convo, {
        receivedJoin: true,
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
      })).filter(convo =>
        convo.receivedJoin || withoutLeadingHash(channel) !== withoutLeadingHash(convo.name)
      ) || SelectList.fromElement(state.getSelected())
    }
    case 'RECEIVE_QUIT': {
      // TODO: flow isn't happy unless i pull these off early, hmmmm
      const { nick, message } = action
      return applyToListWhere(
        state,
        convo => convo.people.map(p => p.name).includes(nick),
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
    case 'RECEIVE_PART': {
      const { nick, message, channels } = action
      return applyToListWhere(
        state,
        convo => channels.includes(convo.name),
        convo => Object.assign({}, convo, {
          people: convo.people.filter(person => person.name !== nick),
          messages: convo.messages.concat({
            type: 'part',
            text: message,
            from: nick,
            to: '',
            when: new Date()
          })
        })
      )
    }
    case 'COMMAND_PART': {
      const { channel } = action
      return state.filter(convo => convo.name !== channel) || SelectList.fromElement(state.getSelected())
    }
    case 'COMMAND_PART_ALL': {
      const { channels } = action
      return state.filter(convo => !channels.includes(convo.name)) || SelectList.fromElement(state.getSelected())
    }
    case 'RECEIVE_TOPIC':
      return addMessageToIdInList(state, action.channel, {
        type: 'topic',
        text: action.topic,
        from: action.channel,
        to: action.channel,
        when: new Date()
      })
    // case RECEIVE_NICK:
    case 'RECEIVE_AWAY': {
      const { message, nick } = action
      return applyToListWhere(
        state,
        convo => convo.people.map(p => p.name).includes(nick),
        convo => Object.assign({}, convo, {
          messages: convo.messages.concat({
            type: 'away',
            text: message,
            from: nick,
            to: '',
            when: new Date()
          })
        })
      )
    }
    case 'SELECT_CONVERSATION': {
      const { conversationId } = action
      return state.selectWhere(convo => conversationId === convo.name)
    }
    default:
      return state
  }
}

function incrementUnreadCount (
  conversation: string,
  convos: SelectList<ConversationT>
): SelectList<ConversationT> {
  return convos.map(convo =>
    convo.name === conversation ? Object.assign({}, convo, {
      unreadCount: convo.unreadCount + 1
    }) : convo
  )
}

function addMessageToIdInList (
  state: SelectList<ConversationT>,
  id: string,
  message: MessageT
): SelectList<ConversationT> {
  return updateIdInList(
    state,
    id,
    convo => Object.assign({}, convo, {
      messages: convo.messages.concat([ message ])
    })
  )
}

function updateIdInList (
  state: SelectList<ConversationT>,
  id: string,
  update: ConversationT => ConversationT
): SelectList<ConversationT> {
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
      type: id[0] === '#' ? 'CHANNEL' : 'DIRECT',
      name: id,
      messages: [],
      people: [],
      receivedJoin: true,
      unreadCount: 0
    })])
  }
}

function applyToListWhere<T> (
  list: SelectList<T>,
  predicate: T => boolean,
  update: T => T
): SelectList<T> {
  return list.map(item =>
    predicate(item) ? update(item) : item
  )
}

function withoutLeadingHash (str: string): string {
  while (str[0] === '#') {
    str = str.slice(1)
  }
  return str
}

export default combineReducers({
  list
})
