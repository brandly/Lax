// @flow
import net from 'net'
import irc from 'slate-irc'
import { createActionSet } from '../modules/createActionSet'
import {
  RECEIVE_NOTICE,
  RECEIVE_AWAY,
  RECEIVE_PART,
  RECEIVE_QUIT,
  // RECEIVE_KICK,
  RECEIVE_MOTD,
  RECEIVE_WELCOME,
  RECEIVE_NICK,
  RECEIVE_TOPIC,
  RECEIVE_JOIN,
  RECEIVE_NAMES,
  RECEIVE_DIRECT_MESSAGE,
  RECEIVE_CHANNEL_MESSAGE
} from '../actions'
import browserHistory from '../modules/browser-history'
import type { Thunk } from '../flow'

export const REQUEST_CONNECTION = createActionSet('REQUEST_CONNECTION')
export const CONNECTION_CLOSED = 'CONNECTION_CLOSED'

type Creds = {
  realName: string,
  nickname: string,
  server: string,
  port: number,
  password: string
};

export const connectToServer = (credentials: Creds) : Thunk => {
  const { realName, nickname, server, port } = credentials
  return dispatch => {
    const id = credentialsToId(credentials)
    const connection = createIrcStream(credentials, dispatch)

    dispatch({
      type: REQUEST_CONNECTION.PENDING,
      connection: {
        id,
        isConnected: false,
        isWelcome: false,
        nickname,
        realName,
        server,
        port,
        stream: connection
      }
    })

    connection.on('errors', e => {
      console.log('errors', e)
    })

    connection.on('mode', e => {
      console.log('mode', e)
    })

    connection.on('invite', e => {
      console.log('invite', e)
    })

    connection.on('notice', e => {
      const channelInMessage = getChannelFromNotice(e.message)

      var to, message
      if (channelInMessage) {
        let splitMessage = e.message.split(' ')
        splitMessage.shift() // remove leading channel name

        to = channelInMessage
        message = splitMessage.join(' ')
      } else {
        to = e.to
        message = e.message
      }

      dispatch({
        type: RECEIVE_NOTICE,
        connectionId: id,
        from: e.from,
        to,
        message
      })
    })

    connection.on('away', e => {
      dispatch({
        type: RECEIVE_AWAY,
        nick: e.nick,
        message: e.message
      })
    })

    connection.on('part', e => {
      dispatch({
        type: RECEIVE_PART,
        nick: e.nick,
        message: e.message
      })
    })

    connection.on('quit', e => {
      dispatch({
        type: RECEIVE_QUIT,
        nick: e.nick,
        message: e.message
      })
    })

    connection.on('kick', e => {
      console.log('kick', e)
    })

    connection.on('motd', e => {
      dispatch({
        type: RECEIVE_MOTD,
        connectionId: id,
        motd: e.motd.join('\n')
      })
    })

    connection.on('welcome', nick => {
      dispatch({
        type: RECEIVE_WELCOME,
        connectionId: id,
        nick
      })
    })

    connection.on('nick', e => {
      dispatch({
        type: RECEIVE_NICK,
        oldNickname: e.nick,
        newNickname: e.new
      })
    })

    connection.on('topic', e => {
      dispatch({
        type: RECEIVE_TOPIC,
        channel: e.channel,
        topic: e.topic
      })
    })

    connection.on('join', e => {
      dispatch({
        type: RECEIVE_JOIN,
        channel: e.channel,
        from: e.nick
      })
    })

    connection.on('names', e => {
      dispatch({
        type: RECEIVE_NAMES,
        channel: e.channel,
        names: e.names
      })
    })

    connection.on('message', e => {
      if (e.to === nickname) {
        dispatch({
          type: RECEIVE_DIRECT_MESSAGE,
          from: e.from,
          message: e.message
        })
      } else {
        dispatch({
          type: RECEIVE_CHANNEL_MESSAGE,
          channel: e.to,
          from: e.from,
          message: e.message
        })
      }
    })
  }
}

function credentialsToId ({ realName, server, port }) {
  return `${realName}@${server}:${port}`
}

function createIrcStream (credentials, dispatch) {
  const { realName, nickname, password, server, port } = credentials
  const id = credentialsToId(credentials)

  let stream = net.connect({
    port,
    host: server
  })

  stream.on('connect', e => {
    dispatch({
      type: REQUEST_CONNECTION.SUCCESS,
      payload: {
        id
      }
    })

    browserHistory.push(`/connection/${id}/conversation`)
  })

  stream.on('close', e => {
    // TODO: figure out how to recover
    // probably want to look at like window focus or "internet is back" events of some sort
    // then check for `ECONNRESET` errors and rebuild the stream(s)
    console.log('stream close', e)
    dispatch({
      type: CONNECTION_CLOSED,
      payload: {
        id
      }
    })
  })

  stream.on('error', e => {
    console.log('stream error', e)
    dispatch({
      type: REQUEST_CONNECTION.ERROR,
      payload: {
        id: credentialsToId(credentials),
        error: e
      }
    })
  })

  let connection = irc(stream)

  if (password) connection.pass(password)
  connection.nick(nickname)
  connection.user(nickname, realName)

  return connection
}

const leadingChannelName = /^\[(#\S+)\]/
function getChannelFromNotice (message) {
  const match = message.match(leadingChannelName)
  return match ? match[1] : null
}
