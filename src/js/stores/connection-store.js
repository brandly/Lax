import net from 'net';
import irc from 'slate-irc';
import assign from 'object-assign';
import EventEmitter from '../modules/event-emitter';
import ircDispatcher from '../dispatchers/irc-dispatcher';
import ActionTypes from '../constants/action-types';
import ChannelActions from '../actions/channel-actions';

const ConnectionStore = assign({}, EventEmitter, {
  connection: null,

  getConnection() {
    return this.connection || null;
  }
});

ConnectionStore.dispatchToken = ircDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.REQUEST_CONNECTION:
      let stream = net.connect({
        port: action.port,
        host: action.server
      });

      let connection = irc(stream);

      if (action.password) connection.pass(action.password);
      connection.nick(action.nickname);
      connection.user(action.nickname, action.realName);

      connection.on('data', e => {
        console.log('data', e);
      });

      connection.on('errors', e => {
        console.log('errors', e);
      });

      connection.on('names', e => {
        console.log('names', e);
      });

      connection.on('message', e => {
        console.log('message', e);
        ChannelActions.receiveMessage({
          channel: e.to,
          from: e.from,
          message: e.message,
          when: new Date() // TODO: use moment?
        });
      });

      ConnectionStore.connection = connection;
      ConnectionStore.emitChange();
      break;
  }
});

module.exports = ConnectionStore;
