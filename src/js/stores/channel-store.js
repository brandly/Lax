import { List } from 'immutable';
import assign from 'object-assign';
import EventEmitter from '../modules/event-emitter';
import ircDispatcher from '../dispatchers/irc-dispatcher';
import ActionTypes from '../constants/action-types';
import ConnectionStore from './connection-store';
import ChannelActions from '../actions/channel-actions';

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

  addPerson(nick) {
    this.people = this.people.push({
      name: nick,
      mode: '' // TODO: verify this is what we want
    });
  }

  removePerson(nick) {
    console.log('TODO: find person, pull them out of List')
  }

  hasNick(nick) {
    const filtered = this.people.filter(p => p.name === nick);
    return filtered.size > 0;
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
  },

  addJoinToChannel(channelName, nick) {
    this.getChannelByName(channelName)
        .addPerson(nick);

    ChannelStore.addMessageToChannel(channelName, {
      type: 'join',
      from: nick,
      message: ''
    });
  },

  addQuitToChannel(channelName, {nick, message}) {
    this.getChannelByName(channelName)
        .removePerson(nick);

    ChannelStore.addMessageToChannel(channelName, {
      type: 'quit',
      from: nick,
      message
    });
  },

  addTopicToChannel(channelName, topic) {
    ChannelStore.addMessageToChannel(channelName, {
      type: 'topic',
      from: channelName,
      message: topic
    });
  },

  addNickToChannel(channelName, {oldNickname, newNickname}) {
    ChannelStore.addMessageToChannel(channelName, {
      type: 'nick',
      from: oldNickname,
      message: newNickname
    });
  },

  getChannelsWithNick(nick) {
    return this.channels.filter(channel => channel.hasNick(nick));
  },
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
      // TODO: figure out this octothorpe situation!!!!
      connection.send('#' + action.channel, action.message);
      ChannelStore.addMessageToChannel(action.channel, {
        type: 'priv',
        message: action.message,
        from: ConnectionStore.nickname
      });
      break;

    case ActionTypes.RECEIVE_JOIN:
      ChannelStore.addJoinToChannel(action.channel, action.from);
      break;

    case ActionTypes.RECEIVE_QUIT:
      ChannelStore.getChannelsWithNick(action.nick).map(channel => {
        ChannelStore.addQuitToChannel(channel.name, {
          nick: action.nick,
          message: action.message
        });
      });
      break;

    case ActionTypes.RECEIVE_TOPIC:
      ChannelStore.addTopicToChannel(action.channel, action.topic);
      break;

    case ActionTypes.RECEIVE_NICK:
      ChannelStore.getChannelsWithNick(action.oldNickname).map(channel => {
        ChannelStore.addNickToChannel(channel.name, {
          oldNickname: action.oldNickname,
          newNickname: action.newNickname
        });
      });
      break;
  }
});

module.exports = ChannelStore;
