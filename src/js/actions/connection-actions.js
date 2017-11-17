import ircDispatcher from '../dispatchers/irc-dispatcher'
import ActionTypes from '../constants/action-types'

export default {
  requestConnection ({realName, nickname, password, server, port}) {
    ircDispatcher.dispatch({
      type: ActionTypes.REQUEST_CONNECTION,
      realName,
      nickname,
      password,
      server,
      port
    })
  },

  receiveWelcome ({nick}) {
    ircDispatcher.dispatch({
      type: ActionTypes.RECEIVE_WELCOME,
      nick
    })
  }
}
