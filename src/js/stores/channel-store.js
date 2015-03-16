import Immutable from 'immutable';
import assign from 'object-assign';
import EventEmitter from '../modules/event-emitter';
import ircDispatcher from '../dispatchers/irc-dispatcher';
import ActionTypes from '../constants/action-types';
import ConnectionStore from './connection-store';

class Channel {
  constructor(name) {
    this.name = name;
    this.messages = Immutable.List();
  }

  getMessages() {
    return this.messages;
  }

  addMessage(message) {
    this.messages = this.messages.push(message);
  }
}

const ChannelStore = assign({}, EventEmitter, {
  channels: Immutable.List(),
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

    let connection = ConnectionStore.getConnection();
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

    case ActionTypes.RECEIVE_MESSAGE:
      let { channel, from, message, when} = action;
      ChannelStore.addMessageToChannel(singleOctothorpe(channel), { from, message, when });
      break;
  }
});

function singleOctothorpe(str) {
  return str.replace(/#+/g, '#');
};

module.exports = ChannelStore;
