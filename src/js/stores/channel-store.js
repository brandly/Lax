import { List } from 'immutable'
import EventEmitter from '../modules/event-emitter'
import ircDispatcher from '../dispatchers/irc-dispatcher'
import ActionTypes from '../constants/action-types'
import ConnectionStore from './connection-store'

class Channel {
  constructor (name) {
    this.name = name
    this.messages = List()
    this.people = List()
    this.unreadCount = 0
  }

  getMessages () {
    return this.messages
  }

  getPeople () {
    return this.people
  }

  setPeople (names) {
    this.people = List.of.apply(List, names)
  }

  addPerson (nick) {
    this.people = this.people.push({
      name: nick,
      mode: '' // TODO: verify this is what we want
    })
  }

  removePerson (nick) {
    const personIndex = this.people.findIndex(person => person.name === nick)
    this.people = this.people.remove(personIndex)
  }

  hasNick (nick) {
    const filtered = this.people.filter(p => p.name === nick)
    return filtered.size > 0
  }

  addMessage (message) {
    message.when = new Date()
    this.messages = this.messages.push(message)
  }
}

const ChannelStore = Object.assign({}, EventEmitter, {
  channels: List(),
  selectedChannelName: null,

  getChannels () {
    return this.channels
  },

  getChannelByName (name) {
    const filtered = this.channels.filter(c => c.name === name)
    return filtered.get(0) || null
  },

  getSelectedChannel () {
    return this.getChannelByName(this.selectedChannelName)
  },

  selectChannel (name) {
    this.selectedChannelName = name
    this.getChannelByName(name).unreadCount = 0
    this.emitChange()
  },

  createChannel (name) {
    const channel = new Channel(name)
    this.channels = this.channels.push(channel)
    return channel
  },

  join (channelName) {
    if (this.getChannelByName(channelName)) return

    this.createChannel(channelName)
    this.selectChannel(channelName)
  },

  part (channelName, message) {
    ConnectionStore.getConnection().part(channelName, message)

    const channelIndex = this.channels.findIndex(channel => channel.name === channelName)
    this.channels = this.channels.remove(channelIndex)

    if (channelName === this.selectedChannelName) {
      this.selectedChannelName = null
    }

    this.emitChange()
  },

  ensureChannelWithName (channelName) {
    return this.getChannelByName(channelName) || this.createChannel(channelName)
  },

  addMessageToChannel (channelName, message) {
    const channel = this.ensureChannelWithName(channelName)

    channel.addMessage(message)
    this.emitChange()
  },

  addPrivMessageToChannel (channelName, {from, message}) {
    if (channelName !== this.selectedChannelName) {
      const channel = this.ensureChannelWithName(channelName)
      channel.unreadCount += 1
    }

    ChannelStore.addMessageToChannel(channelName, {
      type: 'priv',
      from, message
    })
  },

  addNoticeToChannel (channelName, {from, message}) {
    ChannelStore.addMessageToChannel(channelName, {
      type: 'notice',
      from, message
    })
  },

  addJoinToChannel (channelName, nick) {
    this.getChannelByName(channelName)
        .addPerson(nick)

    ChannelStore.addMessageToChannel(channelName, {
      type: 'join',
      from: nick,
      message: ''
    })
  },

  addAwayToChannel (channelName, {nick, message}) {
    ChannelStore.addMessageToChannel(channelName, {
      type: 'away',
      from: nick,
      message
    })
  },

  addPartToChannel (channelName, {nick, message}) {
    this.getChannelByName(channelName)
        .removePerson(nick)

    ChannelStore.addMessageToChannel(channelName, {
      type: 'part',
      from: nick,
      message
    })
  },

  addQuitToChannel (channelName, {nick, message}) {
    this.getChannelByName(channelName)
        .removePerson(nick)

    ChannelStore.addMessageToChannel(channelName, {
      type: 'quit',
      from: nick,
      message
    })
  },

  addTopicToChannel (channelName, topic) {
    ChannelStore.addMessageToChannel(channelName, {
      type: 'topic',
      from: channelName,
      message: topic
    })
  },

  addNickToChannel (channelName, {oldNickname, newNickname}) {
    ChannelStore.addMessageToChannel(channelName, {
      type: 'nick',
      from: oldNickname,
      message: newNickname
    })
  },

  getChannelsWithNick (nick) {
    return this.channels.filter(channel => channel.hasNick(nick))
  }
})

ChannelStore.dispatchToken = ircDispatcher.register(action => {
  switch (action.type) {
    case ActionTypes.SELECT_CHANNEL:
      ChannelStore.selectChannel(action.channelName)
      break

    case ActionTypes.RECEIVE_NAMES:
      ChannelStore
        .getChannelByName(action.channel)
        .setPeople(action.names)
      ChannelStore.emitChange()
      break

    case ActionTypes.RECEIVE_MESSAGE:
      let { channel, from, message } = action
      ChannelStore.addPrivMessageToChannel(channel, {
        from, message
      })
      break

    case ActionTypes.RECEIVE_DIRECT_MESSAGE:
      ChannelStore.addPrivMessageToChannel(action.from, {
        from: action.from,
        message: action.message
      })
      break

    case ActionTypes.SEND_MESSAGE:
      let connection = ConnectionStore.getConnection()
      connection.send(action.channel, action.message)

      ChannelStore.addPrivMessageToChannel(action.channel, {
        message: action.message,
        from: ConnectionStore.nickname
      })
      break

    case ActionTypes.RECEIVE_NOTICE:
      if (ChannelStore.getChannelByName(action.to)) {
        ChannelStore.addNoticeToChannel(action.to, {
          message: action.message,
          from: action.from
        })
      } else {
        console.log('TODO: handle notices to * and nickname', action)
      }
      break

    case ActionTypes.RECEIVE_JOIN:
      if (action.from === ConnectionStore.nickname) {
        ChannelStore.join(action.channel)
      } else {
        ChannelStore.addJoinToChannel(action.channel, action.from)
      }
      break

    case ActionTypes.RECEIVE_AWAY:
      ChannelStore.getChannelsWithNick(action.nick).map(channel => {
        ChannelStore.addAwayToChannel(channel.name, {
          nick: action.nick,
          message: action.message
        })
      })
      break

    case ActionTypes.RECEIVE_PART:
      if (action.nick !== ConnectionStore.nickname) {
        ChannelStore.getChannelsWithNick(action.nick).map(channel => {
          ChannelStore.addPartToChannel(channel.name, {
            nick: action.nick,
            message: action.message
          })
        })
      }
      break

    case ActionTypes.RECEIVE_QUIT:
      ChannelStore.getChannelsWithNick(action.nick).map(channel => {
        ChannelStore.addQuitToChannel(channel.name, {
          nick: action.nick,
          message: action.message
        })
      })
      break

    case ActionTypes.RECEIVE_TOPIC:
      ChannelStore.addTopicToChannel(action.channel, action.topic)
      break

    case ActionTypes.RECEIVE_NICK:
      ChannelStore.getChannelsWithNick(action.oldNickname).map(channel => {
        channel.removePerson(action.oldNickname)
        channel.addPerson(action.newNickname)

        ChannelStore.addNickToChannel(channel.name, {
          oldNickname: action.oldNickname,
          newNickname: action.newNickname
        })
      })
      break

    case ActionTypes.COMMAND_PART:
      ChannelStore.part(action.channel, action.message)
      break

    case ActionTypes.COMMAND_PART_ALL:
      ChannelStore.getChannels().forEach(channel => {
        ChannelStore.part(channel.name, action.message)
      })
      break

    case ActionTypes.COMMAND_UNRECOGNIZED:
      ChannelStore.addMessageToChannel(action.channelName, {
        type: 'error',
        from: '',
        message: 'Unrecognized command: ' + action.command
      })
      break
  }
})

export default ChannelStore
