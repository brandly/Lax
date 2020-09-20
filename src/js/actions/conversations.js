// @flow
import {
  getConnectionById,
  getConversationsForConnection
} from '../reducers/selectors'
import type { ConnectionT, Dispatchable } from '../flow'

export function createMessage({
  connectionId,
  conversationName,
  message
}: {
  connectionId: string,
  conversationName: string,
  message: string
}): Dispatchable {
  message = message.trim()
  return (dispatch, getState) => {
    const connection = getConnectionById(getState(), connectionId)

    if (connection) {
      if (message[0] === '/') {
        dispatch(createCommand(connection, conversationName, message))
      } else {
        dispatch(sendMessage(connection, conversationName, message))
      }
    }
  }
}

function sendMessage(connection: ConnectionT, to: string, message: string) {
  connection.stream.send(to, message)
  return {
    type: 'SEND_MESSAGE',
    connectionId: connection.id,
    to,
    from: connection.nickname,
    message: message
  }
}

function createCommand(
  connection: ConnectionT,
  conversationName: string,
  message: string
): Dispatchable {
  const words = message.split(' ')
  switch (words[0]) {
    case '/join':
      return commandJoin(connection.id, words[1].split(','))
    case '/me':
      return commandMe(
        connection.id,
        conversationName,
        words.slice(1).join(' ')
      )
    case '/nick':
      return commandNick(connection.id, words[1])
    case '/part':
      return commandPart(connection.id, words[1])
    case '/partall':
      return commandPartAll(connection.id)
    // case '/ping':
    // case '/query':
    // case '/quit':
    // case '/ignore':
    // case '/whois':
    // case '/chat':
    // case '/help':
    case '/notice':
      return commandNotice(connection.id, words[1], words.slice(2).join(' '))
    case '/msg': {
      // TODO: confirm that these values are defined?
      const to = words[1]
      const dm = words.slice(2).join(' ')
      return sendMessage(connection, to, dm)
    }
    default:
      return {
        type: 'RECEIVE_DIRECT_MESSAGE',
        connectionId: connection.id,
        from: connection.nickname,
        message: `unexpected command ${words[0]}`
      }
  }
}

export function commandJoin(
  connectionId: string,
  names: string[]
): Dispatchable {
  return (dispatch, getState) => {
    const connection = getConnectionById(getState(), connectionId)

    if (connection) {
      names.forEach((name) => {
        name = name.startsWith('#') ? name : '#' + name
        connection.stream.join(name)

        dispatch({
          type: 'COMMAND_JOIN',
          connectionId,
          name
        })
      })
    }
  }
}

function commandMe(
  connectionId: string,
  target: string,
  message: string
): Dispatchable {
  return (dispatch, getState) => {
    const connection = getConnectionById(getState(), connectionId)

    if (connection) {
      connection.stream.action(target, message)

      dispatch({
        type: 'COMMAND_ME',
        connectionId,
        target,
        message
      })
    }
  }
}

export function commandNick(
  connectionId: string,
  newNickname: string
): Dispatchable {
  return (dispatch, getState) => {
    const connection = getConnectionById(getState(), connectionId)

    if (connection) {
      connection.stream.nick(newNickname)

      dispatch({
        type: 'COMMAND_NICK',
        connectionId,
        newNickname
      })
    }
  }
}

function commandPart(connectionId: string, channel: string): Dispatchable {
  return (dispatch, getState) => {
    const connection = getConnectionById(getState(), connectionId)

    if (connection) {
      connection.stream.part([channel])

      dispatch({
        type: 'COMMAND_PART',
        connectionId,
        channel
      })
    }
  }
}

function commandPartAll(connectionId: string): Dispatchable {
  return (dispatch, getState) => {
    const connection = getConnectionById(getState(), connectionId)
    const conversations = getConversationsForConnection(
      getState(),
      connectionId
    )

    if (connection) {
      const channels = conversations.map((convo) => convo.name)
      connection.stream.part(channels)

      dispatch({
        type: 'COMMAND_PART_ALL',
        connectionId,
        channels
      })
    }
  }
}

export function commandNotice(
  connectionId: string,
  to: string,
  message: string
): Dispatchable {
  return (dispatch, getState) => {
    const connection = getConnectionById(getState(), connectionId)

    if (connection) {
      connection.stream.notice(to, message)

      dispatch({
        type: 'COMMAND_NOTICE',
        connectionId,
        to,
        message
      })
    }
  }
}
