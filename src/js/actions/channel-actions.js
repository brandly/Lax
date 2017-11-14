import ircDispatcher from '../dispatchers/irc-dispatcher'
import ActionTypes from '../constants/action-types'

export default {
  selectChannel ({channelName}) {
    ircDispatcher.dispatch({
      type: ActionTypes.SELECT_CHANNEL,
      channelName
    })
  },

  receiveNames ({channel, names}) {
    ircDispatcher.dispatch({
      type: ActionTypes.RECEIVE_NAMES,
      channel, names
    })
  },

  receiveMessage ({channel, from, message}) {
    ircDispatcher.dispatch({
      type: ActionTypes.RECEIVE_MESSAGE,
      channel, from, message
    })
  },

  receiveDirectMessage ({from, message}) {
    ircDispatcher.dispatch({
      type: ActionTypes.RECEIVE_DIRECT_MESSAGE,
      from, message
    })
  },

  sendMessage ({channel, message}) {
    if (message[0] === '/') {
      const splitMessage = message.split(' ')
      const command = splitMessage.shift()

      switch (command) {
        case '/join':
          this.commandJoin({
            channelName: splitMessage.shift()
          })
          break

        // case '/me':
        //   break;
        // case '/msg':
        //   break;

        case '/nick':
          this.commandNick({
            newNickname: splitMessage.shift()
          })
          break

        // case '/notice':
        //   break;

        case '/part':
          this.commandPart({
            channel: splitMessage.shift(),
            message: splitMessage.join(' ')
          })
          break

        case '/partall':
          this.commandPartAll({
            message: splitMessage.join(' ')
          })
          break

        // case '/ping':
        //   break;
        // case '/query':
        //   break;
        // case '/quit':
        //   break;
        // case '/ignore':
        //   break;
        // case '/whois':
        //   break;
        // case '/chat':
        //   break;
        // case '/help':
        //   break;
        default:
          ircDispatcher.dispatch({
            type: ActionTypes.COMMAND_UNRECOGNIZED,
            command, channelName: channel
          })
          break
      }
    } else {
      ircDispatcher.dispatch({
        type: ActionTypes.SEND_MESSAGE,
        channel, message
      })
    }
  },

  commandJoin ({channelName}) {
    ircDispatcher.dispatch({
      type: ActionTypes.COMMAND_JOIN,
      channelName
    })
  },

  commandNick ({newNickname}) {
    ircDispatcher.dispatch({
      type: ActionTypes.COMMAND_NICK,
      newNickname
    })
  },

  commandPart ({message, channel}) {
    ircDispatcher.dispatch({
      type: ActionTypes.COMMAND_PART,
      message, channel
    })
  },

  commandPartAll ({message}) {
    ircDispatcher.dispatch({
      type: ActionTypes.COMMAND_PART_ALL,
      message
    })
  },

  receiveNotice ({to, from, message}) {
    ircDispatcher.dispatch({
      type: ActionTypes.RECEIVE_NOTICE,
      to, from, message
    })
  },

  receiveJoin ({channel, from}) {
    ircDispatcher.dispatch({
      type: ActionTypes.RECEIVE_JOIN,
      channel, from
    })
  },

  receiveAway ({nick, message}) {
    ircDispatcher.dispatch({
      type: ActionTypes.RECEIVE_AWAY,
      nick, message
    })
  },

  receivePart ({nick, message}) {
    ircDispatcher.dispatch({
      type: ActionTypes.RECEIVE_PART,
      nick, message
    })
  },

  receiveQuit ({nick, message}) {
    ircDispatcher.dispatch({
      type: ActionTypes.RECEIVE_QUIT,
      nick, message
    })
  },

  receiveTopic ({channel, topic}) {
    ircDispatcher.dispatch({
      type: ActionTypes.RECEIVE_TOPIC,
      channel, topic
    })
  },

  receiveNick ({oldNickname, newNickname}) {
    ircDispatcher.dispatch({
      type: ActionTypes.RECEIVE_NICK,
      oldNickname, newNickname
    })
  }
}
