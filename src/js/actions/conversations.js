// @flow
import {
  getConnectionById
} from '../reducers/selectors'
import type { Thunk } from '../flow'

export function sendMessage ({
  connectionId, to, message
}: {
  connectionId: string,
  to: string,
  message: string
}): Thunk {
  return (dispatch, getState) => {
    const connection = getConnectionById(getState(), connectionId)

    if (connection) {
      connection.stream.send(to, message)

      dispatch({
        type: 'SEND_MESSAGE',
        connectionId: connection.id,
        to: to,
        from: connection.nickname,
        message: message
      })
    }
  }
}

export function commandJoin (connectionId: string, name: string): Thunk {
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

export function commandNick (connectionId: string, newNickname: string): Thunk {
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
