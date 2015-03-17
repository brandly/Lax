import { List } from 'immutable';
import assign from 'object-assign';
import EventEmitter from '../modules/event-emitter';
import ircDispatcher from '../dispatchers/irc-dispatcher';
import ActionTypes from '../constants/action-types';
import ConnectionStore from './connection-store';

class Channel {
  constructor(name) {
    this.name = name;
    this.messages = List();
    this.people = List();
  }

  getMessages() {
    return this.messages;
  }

  getPeople() {
    return this.people;
  }

  setPeople(names) {
    this.people = List.of.apply(List, names);
  }

  addMessage(message) {
    message.when = new Date();
    this.messages = this.messages.push(message);
  }
}

const ChannelStore = assign({}, EventEmitter, {
  channels: List(),
  selectedChannelName: null,

  getChannels() {
    return this.channels;
  },

  getChannelByName(name) {
    const filtered = this.channels.filter(c => c.name === name);
    return filtered.get(0) || null;
  },

  getSelectedChannel() {
    return this.getChannelByName(this.selectedChannelName);
  },

  selectChannel(name) {
    this.selectedChannelName = name;
    this.emitChange();
  },

  join(channelName) {
    if (!!this.getChannelByName(channelName)) return;

    const connection = ConnectionStore.getConnection();
    connection.join(channelName);

    this.channels = this.channels.push(new Channel(channelName));
    this.selectChannel(channelName);
  },

  addMessageToChannel(channelName, message) {
    this.getChannelByName(channelName)
        .addMessage(message);
    this.emitChange();
  }
});

ChannelStore.dispatchToken = ircDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.REQUEST_JOIN_CHANNEL:
      ChannelStore.join(action.channelName);
      break;

    case ActionTypes.SELECT_CHANNEL:
      ChannelStore.selectChannel(action.channelName);
      break;

    case ActionTypes.RECEIVE_NAMES:
      ChannelStore
        .getChannelByName(action.channel)
        .setPeople(action.names);
      ChannelStore.emitChange();
      break;

    case ActionTypes.RECEIVE_MESSAGE:
      let { channel, from, message } = action;
      ChannelStore.addMessageToChannel(channel, {
        type: 'priv',
        from, message
      });
      break;

    case ActionTypes.SEND_MESSAGE:
      let connection = ConnectionStore.getConnection();
      // TODO: figure out why this doesn't work
      console.log('SENDING', action.channel, action.message);
      connection.send(action.channel, action.message);
      break;

    case ActionTypes.RECEIVE_JOIN:
      ChannelStore.addMessageToChannel(action.channel, {
        type: 'join',
        from: action.from,
        message: ''
      });
      ChannelStore.emitChange();
      break;

    case ActionTypes.RECEIVE_TOPIC:
      ChannelStore.addMessageToChannel(action.channel, {
        type: 'topic',
        from: action.channel,
        message: action.topic
      });
      ChannelStore.emitChange();
      break;
  }
});

module.exports = ChannelStore;
