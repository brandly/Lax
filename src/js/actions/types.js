// @flow
import Case from 'case'

const prefix = (prefix: string, obj) => {
  return Object.keys(obj).reduce((store, key) => {
    store[Case.camel(key)] = prefix + '_' + key
    return store
  }, {})
}

export const COMMAND = prefix('COMMAND', {
  JOIN: null,
  ME: null,
  MSG: null,
  NICK: null,
  NOTICE: null,
  PART: null,
  PART_ALL: null,
  PING: null,
  QUERY: null,
  QUIT: null,
  IGNORE: null,
  WHOIS: null,
  CHAT: null,
  HELP: null,
  UNRECOGNIZED: null
})

// REQUEST_CONNECTION: null,
// RECEIVE_WELCOME: null,
// SELECT_CHANNEL: null,
// RECEIVE_NAMES: null,
// RECEIVE_MESSAGE: null,
// RECEIVE_DIRECT_MESSAGE: null,
// SEND_MESSAGE: null,
// RECEIVE_NOTICE: null,
// RECEIVE_JOIN: null,
// RECEIVE_AWAY: null,
// RECEIVE_PART: null,
// RECEIVE_QUIT: null,
// RECEIVE_TOPIC: null,
// RECEIVE_NICK: null
