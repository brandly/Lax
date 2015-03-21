import net from 'net';
import irc from 'slate-irc';
import assign from 'object-assign';
import EventEmitter from '../modules/event-emitter';
import ircDispatcher from '../dispatchers/irc-dispatcher';
import ActionTypes from '../constants/action-types';
import ChannelActions from '../actions/channel-actions';
import ConnectionActions from '../actions/connection-actions';

const ConnectionStore = assign({}, EventEmitter, {
  connection: null,
  server: null,
  nickname: null,
  realName: null,
  isWelcome: false,

  getConnection() {
    return this.connection || null;
  },

  getNickname() {
    return this.nickname;
  },

  setWelcome(val) {
    this.isWelcome = val;
    this.emitChange();
  }
});

ConnectionStore.dispatchToken = ircDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.REQUEST_CONNECTION:
      let stream = net.connect({
        port: action.port,
        host: action.server
      });

      stream.on('connect', e => {
        console.log('stream connect', e);
      });

      stream.on('close', e => {
        console.log('stream close', e);
      });

      stream.on('error', e => {
        console.log('stream error', e);
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
        ChannelActions.receiveAway({
          nick: e.nick,
          message: e.message
        });
      });

      connection.on('part', e => {
        ChannelActions.receivePart({
          nick: e.nick,
          message: e.message
        });
      });

      connection.on('quit', e => {
        ChannelActions.receiveQuit({
          nick: e.nick,
          message: e.message
        });
      });

      connection.on('kick', e => {
        console.log('kick', e);
      });

      connection.on('motd', e => {
        console.log('motd', e);
      });

      connection.on('welcome', nick => {
        ConnectionActions.receiveWelcome({ nick });
      });

      connection.on('nick', e => {
        ChannelActions.receiveNick({
          oldNickname: e.nick,
          newNickname: e.new
        });
      });

      connection.on('topic', e => {
        ChannelActions.receiveTopic({
          channel: e.channel,
          topic: e.topic
        });
      });

      connection.on('join', e => {
        ChannelActions.receiveJoin({
          channel: e.channel,
          from: e.nick
        });
      });

      connection.on('names', e => {
        ChannelActions.receiveNames({
          channel: e.channel,
          names: e.names
        });
      });

      connection.on('message', e => {
        if (e.to === ConnectionStore.nickname) {
          ChannelActions.receiveDirectMessage({
            from: e.from,
            message: e.message
          });
        } else {
          ChannelActions.receiveMessage({
            channel: e.to,
            from: e.from,
            message: e.message
          });
        }
      });

      ConnectionStore.connection = connection;
      ConnectionStore.nickname = action.nickname;
      ConnectionStore.realName = action.realName;
      ConnectionStore.server = action.server;
      ConnectionStore.emitChange();
      break;

    case ActionTypes.RECEIVE_WELCOME:
      // TODO: check that action.nick is the nickname, once we have multi connections
      ConnectionStore.setWelcome(true);
      break;

    case ActionTypes.REQUEST_JOIN_CHANNEL:
      ConnectionStore.getConnection().join(action.channelName);
      break;
  }
});

module.exports = ConnectionStore;
