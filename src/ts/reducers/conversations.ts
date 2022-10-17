import { v4 as uuid } from 'uuid'
import SelectList from '../modules/SelectList'
import equalNames from '../modules/equalNames'
import type { ConversationT, ConversationType, MessageT, Action } from '../flow'
export default function list(
  state: SelectList<ConversationT> | null | undefined = null,
  action: Action
): SelectList<ConversationT> | null {
  console.debug('conversation list', JSON.stringify(action))
  if (action.type === 'REQUEST_CONNECTION_SUCCESS') {
    const add: ConversationT = {
      type: 'CONNECTION',
      name: action.connection.id,
      messages: [],
      people: [],
      receivedJoin: true,
      unreadCount: 0
    }
    return state ? state.concat([]) : SelectList.fromElement(add)
  } else if (!state) {
    return null
  } else {
    return guaranteedList(state, action).applyToSelected((convo) => ({
      ...convo,
      unreadCount: 0
    }))
  }
}

function guaranteedList(
  state: SelectList<ConversationT>,
  action: Action
): SelectList<ConversationT> {
  switch (action.type) {
    case 'IRC_ERROR':
      return addMessageToIdInList(
        state,
        action.connectionId,
        makeMessage({
          type: 'error',
          text: action.message
        })
      )

    case 'RECEIVE_MOTD':
      return addMessageToIdInList(
        state,
        action.connectionId,
        makeMessage({
          type: 'motd',
          text: action.motd
        })
      )

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
      return addMessageToIdInList(
        state,
        action.connectionId,
        makeMessage({
          type: 'welcome',
          to: action.nick
        })
      )

    case 'SEND_MESSAGE':
      return addMessageToIdInList(
        state,
        action.to,
        makeMessage({
          type: 'priv',
          text: action.message,
          from: action.from,
          to: action.to
        })
      )

    case 'RECEIVE_DIRECT_MESSAGE':
      return incrementUnreadCount(
        action.from,
        addMessageToIdInList(
          state,
          action.from,
          makeMessage({
            type: 'priv',
            text: action.message,
            from: action.from
          })
        )
      )

    case 'RECEIVE_CHANNEL_MESSAGE':
      return incrementUnreadCount(
        action.channel,
        addMessageToIdInList(
          state,
          action.channel,
          makeMessage({
            type: 'priv',
            text: action.message,
            from: action.from,
            to: action.channel
          })
        )
      )

    case 'RECEIVE_ACTION':
      return incrementUnreadCount(
        action.channel,
        addMessageToIdInList(
          state,
          action.channel,
          makeMessage({
            type: 'action',
            text: action.message,
            from: action.from
          })
        )
      )

    case 'COMMAND_JOIN': {
      const currentChannels = state.toArray().map((c) => c.name)

      if (currentChannels.includes(action.name)) {
        const { name } = action
        return state.selectWhere((convo) => equalNames(convo.name, name))
      } else {
        return state
      }
    }

    case 'RECEIVE_NAMES': {
      return updateIdInList(state, action.channel, (convo) => ({
        ...convo,
        people: action.names
      })).selectWhere((convo) => equalNames(convo.name, action.channel))
    }

    case 'RECEIVE_JOIN': {
      return updateIdInList(state, action.channel, (convo) => ({
        ...convo,
        receivedJoin: true,
        people: convo.people.concat({
          name: action.from,
          mode: ''
        }),
        messages: convo.messages.concat(
          makeMessage({
            type: 'join',
            from: action.from,
            to: action.channel
          })
        )
      }))
    }

    case 'RECEIVE_QUIT': {
      return applyToListWhere(
        state,
        (convo) => convo.people.map((p) => p.name).includes(action.nick),
        (convo) => ({
          ...convo,
          people: convo.people.filter((person) => person.name !== action.nick),
          messages: convo.messages.concat([
            makeMessage({
              type: 'quit',
              text: action.message,
              from: action.nick
            })
          ])
        })
      )
    }

    case 'RECEIVE_PART': {
      return applyToListWhere(
        state,
        (convo) => action.channels.includes(convo.name),
        (convo) => ({
          ...convo,
          people: convo.people.filter((person) => person.name !== action.nick),
          messages: convo.messages.concat(
            makeMessage({
              type: 'part',
              text: action.message,
              from: action.nick
            })
          )
        })
      )
    }

    case 'COMMAND_PART': {
      return (
        state.filter((convo) => convo.name !== action.channel) ||
        SelectList.fromElement(state.getSelected())
      )
    }

    case 'COMMAND_PART_ALL': {
      return (
        state.filter((convo) => !action.channels.includes(convo.name)) ||
        SelectList.fromElement(state.getSelected())
      )
    }

    case 'RECEIVE_TOPIC':
      return addMessageToIdInList(
        state,
        action.channel,
        makeMessage({
          type: 'topic',
          text: action.topic,
          from: action.channel,
          to: action.channel
        })
      )

    case 'RECEIVE_NICK': {
      return applyToListWhere(
        state,
        (convo) => convo.people.map((p) => p.name).includes(action.oldNickname),
        (convo) => ({
          ...convo,
          people: convo.people.map((person) =>
            person.name === action.oldNickname
              ? { ...person, name: action.newNickname }
              : person
          ),
          messages: convo.messages.map((message) =>
            message.from === action.oldNickname
              ? { ...message, from: action.newNickname }
              : message
          )
        })
      )
    }

    case 'RECEIVE_AWAY': {
      return applyToListWhere(
        state,
        (convo) => convo.people.map((p) => p.name).includes(action.nick),
        (convo) => ({
          ...convo,
          messages: convo.messages.concat(
            makeMessage({
              type: 'away',
              text: action.message,
              from: action.nick
            })
          )
        })
      )
    }

    case 'SELECT_CONVERSATION': {
      const { conversationId } = action
      const currentChannels = state.toArray().map((c) => c.name)

      if (!currentChannels.includes(conversationId)) {
        state = state.concat([
          {
            type: typeForId(conversationId),
            name: conversationId,
            messages: [],
            people: [],
            receivedJoin: false,
            unreadCount: 0
          }
        ])
      }

      return state.selectWhere((convo) =>
        equalNames(convo.name, conversationId)
      )
    }

    case 'NOTIFICATION_CLICK': {
      const { via } = action

      if (
        via.type === 'RECEIVE_DIRECT_MESSAGE' ||
        via.type === 'RECEIVE_CHANNEL_MESSAGE'
      ) {
        return state.selectWhere((convo) => equalNames(via.from, convo.name))
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
  return convos.map((convo) =>
    equalNames(convo.name, conversation)
      ? {
          ...convo,
          unreadCount: convo.unreadCount + 1
        }
      : convo
  )
}

function addMessageToIdInList(
  state: SelectList<ConversationT>,
  id: string,
  message: MessageT
): SelectList<ConversationT> {
  return updateIdInList(state, id, (convo) => ({
    ...convo,
    messages: convo.messages.concat([message])
  }))
}

function updateIdInList(
  state: SelectList<ConversationT>,
  id: string,
  update: (arg0: ConversationT) => ConversationT
): SelectList<ConversationT> {
  let foundOne = false
  const result = state.map((conversation) => {
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
    return result.concat([
      update({
        type: typeForId(id),
        name: id,
        messages: [],
        people: [],
        receivedJoin: true,
        unreadCount: 0
      })
    ])
  }
}

function typeForId(id: string): ConversationType {
  return id[0] === '#' ? 'CHANNEL' : 'DIRECT'
}

function applyToListWhere<T>(
  list: SelectList<T>,
  predicate: (arg0: T) => boolean,
  update: (arg0: T) => T
): SelectList<T> {
  return list.map((item) => (predicate(item) ? update(item) : item))
}

function makeMessage(data: Partial<MessageT>): MessageT {
  return {
    id: uuid(),
    when: new Date(),
    from: '',
    text: '',
    to: '',
    type: 'priv',
    ...data
  }
}
