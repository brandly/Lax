import ircDispatcher from '../dispatchers/irc-dispatcher';
import ActionTypes from '../constants/action-types';

module.exports = {
  requestConnection({realName, nickname, password, server, port}) {
    ircDispatcher.dispatch({
      type: ActionTypes.REQUEST_CONNECTION,
      realName, nickname, password, server, port
    })
  }
};
