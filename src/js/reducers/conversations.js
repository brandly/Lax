// @flow
/* global $Shape */
import uuid from 'uuid/v4'
import SelectList from '../modules/SelectList'
import equalNames from '../modules/equalNames'
import type {
  ConversationT,
  ConversationType,
  MessageT,
  Action
} from '../flow'

function list(
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

function guaranteedList(
  state: SelectList<ConversationT>,
  action: Action
): SelectList<ConversationT> {
  switch (action.type) {
    case 'RECEIVE_MOTD':
      return addMessageToIdInList(state, action.connectionId, makeMessage({
        type: 'motd',
        text: action.motd
      }))
    case 'RECEIVE_NOTICE':
      return addMessageToIdInList(
        state,
        action.to === '*' ? action.connectionId : action.from,
        makeMessage({
          type: 'notice',
          text: action.message,
          from: action.from,
          to: action.to
        })
      )
    case 'RECEIVE_WELCOME':
      return addMessageToIdInList(state, action.connectionId, makeMessage({
        type: 'welcome',
        to: action.nick
      }))
    case 'SEND_MESSAGE':
      return addMessageToIdInList(state, action.to, makeMessage({
        type: 'priv',
        text: action.message,
        from: action.from,
        to: action.to
      }))
    case 'RECEIVE_DIRECT_MESSAGE':
      return incrementUnreadCount(action.from,
        addMessageToIdInList(state, action.from, makeMessage({
          type: 'priv',
          text: action.message,
          from: action.from
        }))
      )
    case 'RECEIVE_CHANNEL_MESSAGE':
      return incrementUnreadCount(action.channel,
        addMessageToIdInList(state, action.channel, makeMessage({
          type: 'priv',
          text: action.message,
          from: action.from,
          to: action.channel
        }))
      )
    case 'RECEIVE_ACTION':
      return incrementUnreadCount(action.channel,
        addMessageToIdInList(state, action.channel, makeMessage({
          type: 'action',
          text: action.message,
          from: action.from
        }))
      )
    case 'COMMAND_JOIN': {
      const currentChannels = state.toArray().map(c => c.name)
      if (currentChannels.includes(action.name)) {
        const { name } = action
        return state.selectWhere(convo => equalNames(convo.name, name))
      } else {
        return state.concat([{
          type: typeForId(action.name),
          name: action.name.toLowerCase(),
          messages: [],
          people: [],
          receivedJoin: false,
          unreadCount: 0
        }])
      }
    }
    case 'RECEIVE_NAMES': {
      const { names, channel } = action
      return updateIdInList(state, channel, convo => Object.assign({}, convo, {
        people: names
      })).selectWhere(convo => equalNames(convo.name, channel))
    }
    case 'RECEIVE_JOIN': {
      const { channel, from } = action
      return updateIdInList(state, channel, convo => Object.assign({}, convo, {
        receivedJoin: true,
        people: convo.people.concat({
          name: from,
          mode: ''
        }),
        messages: convo.messages.concat(makeMessage({
          type: 'join',
          from: from,
          to: channel
        }))
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
          messages: convo.messages.concat([makeMessage({
            type: 'quit',
            text: message,
            from: nick
          })])
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
          messages: convo.messages.concat(makeMessage({
            type: 'part',
            text: message,
            from: nick
          }))
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
      return addMessageToIdInList(state, action.channel, makeMessage({
        type: 'topic',
        text: action.topic,
        from: action.channel,
        to: action.channel
      }))
    // case RECEIVE_NICK:
    case 'RECEIVE_AWAY': {
      const { message, nick } = action
      return applyToListWhere(
        state,
        convo => convo.people.map(p => p.name).includes(nick),
        convo => Object.assign({}, convo, {
          messages: convo.messages.concat(makeMessage({
            type: 'away',
            text: message,
            from: nick
          }))
        })
      )
    }
    case 'SELECT_CONVERSATION': {
      const { conversationId } = action
      return state.selectWhere(convo => equalNames(conversationId, convo.name))
    }
    case 'NOTIFICATION_CLICK': {
      const { via } = action
      if (via.type === 'RECEIVE_DIRECT_MESSAGE' || via.type === 'RECEIVE_CHANNEL_MESSAGE') {
        return state.selectWhere(convo => equalNames(via.from, convo.name))
      } else {
        return state
      }
    }
    default:
      return state
  }
}

function incrementUnreadCount(
  conversation: string,
  convos: SelectList<ConversationT>
): SelectList<ConversationT> {
  return convos.map(convo =>
    equalNames(convo.name, conversation) ? Object.assign({}, convo, {
      unreadCount: convo.unreadCount + 1
    }) : convo
  )
}

function addMessageToIdInList(
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

function updateIdInList(
  state: SelectList<ConversationT>,
  id: string,
  update: ConversationT => ConversationT
): SelectList<ConversationT> {
  let foundOne = false

  const result = state.map(conversation => {
    if (equalNames(conversation.name, id)) {
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
      type: typeForId(id),
      name: id,
      messages: [],
      people: [],
      receivedJoin: true,
      unreadCount: 0
    })])
  }
}

function typeForId(id: string): ConversationType {
  return id[0] === '#' ? 'CHANNEL' : 'DIRECT'
}

function applyToListWhere<T>(
  list: SelectList<T>,
  predicate: T => boolean,
  update: T => T
): SelectList<T> {
  return list.map(item =>
    predicate(item) ? update(item) : item
  )
}

function withoutLeadingHash(str: string): string {
  while (str[0] === '#') {
    str = str.slice(1)
  }
  return str
}

function makeMessage(data: $Shape<MessageT>): MessageT {
  return Object.assign({
    id: uuid(),
    when: new Date(),
    from: '',
    text: '',
    to: '',
    type: 'priv'
  }, data)
}

export default list
