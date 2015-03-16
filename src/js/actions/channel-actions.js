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

  receiveMessage({channel, from, message, when}) {
    ircDispatcher.dispatch({
      type: ActionTypes.RECEIVE_MESSAGE,
      channel, from, message, when
    });
  }
};
