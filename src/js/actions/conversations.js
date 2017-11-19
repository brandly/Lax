// @flow
import {
  getConnectionById
} from '../reducers/selectors'
import type { Thunk } from '../flow'

export const RECEIVE_NOTICE = 'RECEIVE_NOTICE'
export const RECEIVE_AWAY = 'RECEIVE_AWAY'
export const RECEIVE_PART = 'RECEIVE_PART'
export const RECEIVE_QUIT = 'RECEIVE_QUIT'
export const RECEIVE_KICK = 'RECEIVE_KICK'
export const RECEIVE_MOTD = 'RECEIVE_MOTD'
export const RECEIVE_WELCOME = 'RECEIVE_WELCOME'
export const RECEIVE_NICK = 'RECEIVE_NICK'
export const RECEIVE_TOPIC = 'RECEIVE_TOPIC'
export const RECEIVE_JOIN = 'RECEIVE_JOIN'
export const RECEIVE_NAMES = 'RECEIVE_NAMES'
export const RECEIVE_DIRECT_MESSAGE = 'RECEIVE_DIRECT_MESSAGE'
export const RECEIVE_CHANNEL_MESSAGE = 'RECEIVE_CHANNEL_MESSAGE'

export function commandJoin (connectionId: string, name: string) : Thunk {
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

export function commandNick (connectionId: string, newNickname: string) : Thunk {
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
