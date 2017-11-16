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

export const REQUEST_CONNECTION = createActionSet('REQUEST_CONNECTION')

export const connectToServer = (credentials) => {
  const { realName, nickname, server, port } = credentials
  return dispatch => {
    const id = credentialsToId(credentials)
    const connection = createIrcStream(credentials, dispatch)

    dispatch({
      type: REQUEST_CONNECTION.PENDING,
      payload: {
        id,
        isConnected: false,
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

      // TODO: these can be from another person? need to understand what a notice is
      dispatch({
        type: RECEIVE_NOTICE,
        payload: {
          connectionId: id,
          from: e.from,
          to,
          message
        }
      })
    })

    connection.on('away', e => {
      dispatch({
        type: RECEIVE_AWAY,
        payload: {
          nick: e.nick,
          message: e.message
        }
      })
    })

    connection.on('part', e => {
      dispatch({
        type: RECEIVE_PART,
        payload: {
          nick: e.nick,
          message: e.message
        }
      })
    })

    connection.on('quit', e => {
      dispatch({
        type: RECEIVE_QUIT,
        payload: {
          nick: e.nick,
          message: e.message
        }
      })
    })

    connection.on('kick', e => {
      console.log('kick', e)
    })

    connection.on('motd', e => {
      dispatch({
        type: RECEIVE_MOTD,
        payload: {
          connectionId: id,
          motd: e.motd.join('\n')
        }
      })
    })

    connection.on('welcome', nick => {
      dispatch({
        type: RECEIVE_WELCOME,
        payload: {
          connectionId: id,
          nick
        }
      })
    })

    connection.on('nick', e => {
      dispatch({
        type: RECEIVE_NICK,
        payload: {
          oldNickname: e.nick,
          newNickname: e.new
        }
      })
    })

    connection.on('topic', e => {
      dispatch({
        type: RECEIVE_TOPIC,
        payload: {
          channel: e.channel,
          topic: e.topic
        }
      })
    })

    connection.on('join', e => {
      dispatch({
        type: RECEIVE_JOIN,
        payload: {
          channel: e.channel,
          from: e.nick
        }
      })
    })

    connection.on('names', e => {
      dispatch({
        type: RECEIVE_NAMES,
        payload: {
          channel: e.channel,
          names: e.names
        }
      })
    })

    connection.on('message', e => {
      if (e.to === nickname) {
        dispatch({
          type: RECEIVE_DIRECT_MESSAGE,
          payload: {
            from: e.from,
            message: e.message
          }
        })
      } else {
        dispatch({
          type: RECEIVE_CHANNEL_MESSAGE,
          payload: {
            channel: e.to,
            from: e.from,
            message: e.message
          }
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

  let stream = net.connect({
    port,
    host: server
  })

  stream.on('connect', e => {
    const id = credentialsToId(credentials)
    dispatch({
      type: REQUEST_CONNECTION.SUCCESS,
      payload: {
        id
      }
    })

    browserHistory.push(`/connection/${id}/conversation`)
  })

  stream.on('close', e => {
    // TODO:
    console.log('stream close', e)
  })

  stream.on('error', e => {
    console.log('stream error', e)
    dispatch({
      type: REQUEST_CONNECTION.error,
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
