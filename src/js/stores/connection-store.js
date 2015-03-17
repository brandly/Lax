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

      // connection.on('data', e => {
      //   console.log('data', e);
      // });

      connection.on('errors', e => {
        console.log('errors', e);
      });

      connection.on('notice', e => {
        console.log('notice', e);
      });

      connection.on('mode', e => {
        console.log('mode', e);
      });

      connection.on('invite', e => {
        console.log('invite', e);
      });

      connection.on('away', e => {
        console.log('away', e);
      });

      connection.on('quit', e => {
        // TODO: figure out how to get channel here
        console.log('quit', e);
      });

      connection.on('part', e => {
        console.log('part', e);
      });

      connection.on('kick', e => {
        console.log('kick', e);
      });

      connection.on('motd', e => {
        console.log('motd', e);
      });

      connection.on('nick', e => {
        console.log('nick', e);
      });

      connection.on('welcome', e => {
        console.log('welcome', e);
      });

      connection.on('topic', e => {
        ChannelActions.receiveTopic({
          channel: singleOctothorpe(e.channel),
          topic: e.topic
        });
      });

      connection.on('join', e => {
        ChannelActions.receiveJoin({
          channel: singleOctothorpe(e.channel),
          from: e.nick
        });
      });

      connection.on('names', e => {
        ChannelActions.receiveNames({
          channel: singleOctothorpe(e.channel),
          names: e.names
        });
      });

      connection.on('message', e => {
        ChannelActions.receiveMessage({
          channel: singleOctothorpe(e.to),
          from: e.from,
          message: e.message
        });
      });

      ConnectionStore.connection = connection;
      ConnectionStore.emitChange();
      break;
  }
});

module.exports = ConnectionStore;

// TODO: figure out this single/double octothorpe business
function singleOctothorpe(str) {
  return str.replace(/#+/g, '#');
};
