import ircDispatcher from '../dispatchers/irc-dispatcher';
import ActionTypes from '../constants/action-types';

module.exports = {
  requestJoinChannel({channelName}) {
    ircDispatcher.dispatch({
      type: ActionTypes.REQUEST_JOIN_CHANNEL,
      channelName
    })
  },

  selectChannel({channelName}) {
    ircDispatcher.dispatch({
      type: ActionTypes.SELECT_CHANNEL,
      channelName
    });
  },

  receiveNames({channel, names}) {
    ircDispatcher.dispatch({
      type: ActionTypes.RECEIVE_NAMES,
      channel, names
    })
  },

  receiveMessage({channel, from, message}) {
    ircDispatcher.dispatch({
      type: ActionTypes.RECEIVE_MESSAGE,
      channel, from, message
    });
  },

  sendMessage({channel, message}) {
    ircDispatcher.dispatch({
      type: ActionTypes.SEND_MESSAGE,
      channel, message
    });
  },

  receiveJoin({channel, from}) {
    ircDispatcher.dispatch({
      type: ActionTypes.RECEIVE_JOIN,
      channel, from
    });
  },

  receiveAway({nick, message}) {
    ircDispatcher.dispatch({
      type: ActionTypes.RECEIVE_AWAY,
      channel, from
    });
  },

  receivePart({nick, message}) {
    ircDispatcher.dispatch({
      type: ActionTypes.RECEIVE_PART,
      nick, message
    });
  },

  receiveQuit({nick, message}) {
    ircDispatcher.dispatch({
      type: ActionTypes.RECEIVE_QUIT,
      nick, message
    });
  },

  receiveTopic({channel, topic}) {
    ircDispatcher.dispatch({
      type: ActionTypes.RECEIVE_TOPIC,
      channel, topic
    });
  },

  receiveNick({oldNickname, newNickname}) {
    ircDispatcher.dispatch({
      type: ActionTypes.RECEIVE_NICK,
      oldNickname, newNickname
    });
  }
};
