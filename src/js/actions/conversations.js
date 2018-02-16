// @flow
import {
  getConnectionById
} from '../reducers/selectors'
import type { ConnectionT, Dispatchable } from '../flow'

export function createMessage ({
  connectionId, conversationName, message
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
        dispatch(createCommand(connection, message))
      } else {
        dispatch(sendMessage(connection, conversationName, message))
      }
    }
  }
}

function sendMessage (connection: ConnectionT, to: string, message: string) {
  connection.stream.send(to, message)
  return {
    type: 'SEND_MESSAGE',
    connectionId: connection.id,
    to,
    from: connection.nickname,
    message: message
  }
}

function createCommand (connection: ConnectionT, message: string): Dispatchable {
  const words = message.split(' ')
  switch (words[0]) {
    case '/join':
      return commandJoin(connection.id, words[1])
    // case '/me':
    case '/nick':
      return commandNick(connection.id, words[1])
    // case '/part':
    // case '/partall':
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
      console.error('TODO: handle unexected command')
      return {
        type: 'RECEIVE_DIRECT_MESSAGE',
        from: connection.nickname,
        message: `unexected command ${words[0]}`
      }
  }
}

export function commandJoin (connectionId: string, name: string): Dispatchable {
  return (dispatch, getState) => {
    const connection = getConnectionById(getState(), connectionId)

    if (connection) {
      connection.stream.join(name)

      dispatch({
        type: 'COMMAND_JOIN',
        name
      })
    }
  }
}

export function commandNick (connectionId: string, newNickname: string): Dispatchable {
  return (dispatch, getState) => {
    const connection = getConnectionById(getState(), connectionId)

    if (connection) {
      connection.stream.nick(newNickname)

      dispatch({
        type: 'COMMAND_NICK',
        newNickname
      })
    }
  }
}

export function commandNotice (connectionId: string, to: string, message: string): Dispatchable {
  return (dispatch, getState) => {
    const connection = getConnectionById(getState(), connectionId)

    if (connection) {
      connection.stream.notice(to, message)

      dispatch({
        type: 'COMMAND_NOTICE',
        to,
        message
      })
    }
  }
}
