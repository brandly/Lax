// @flow
import type {
  Store as ReduxStore
  // Dispatch as ReduxDispatch
} from 'redux'

type IrcConnectionStream = {
  join: string => void,
  nick: string => void,
  send: (to: string, msg: string) => void,
  notice: (string, string) => void,
  action: (target: string, msg: string) => void,
  part: (channel: Array<string>) => void
};

export type ConnectionT = {
  id: string,
  isConnected: boolean,
  isWelcome: boolean,
  nickname: string,
  realName: string,
  server: string,
  port: number,
  stream: IrcConnectionStream,
  error: ?string
};

export type PersonT = {
  name: string,
  mode: string
};

type MessageType
  = 'notice'
  | 'priv'
  | 'motd'
  | 'welcome'
  | 'topic'
  | 'flow'
  | 'join'
  | 'away'
  | 'part'
  | 'quit'
  ;

export type MessageT = {
  type: MessageType,
  text: string,
  from: string,
  to: string,
  when: Date
};

type ConversationType
  = 'CHANNEL'
  | 'DIRECT'
  | 'CONNECTION'
  ;

export type ConversationT = {
  type: ConversationType,
  name: string,
  messages: Array<MessageT>,
  people: Array<PersonT>,
  receivedJoin: boolean
};

export type RouteT
  = { view: 'CONNECTION_CREATOR' }
  | { view: 'CONNECTION', connectionId: string, conversationId: ?string }
  ;

export type IrcState = {
  conversations: {
    list: Array<ConversationT>
  },
  connections: {
    list: Array<ConnectionT>
  },
  route: RouteT
};

export type Action
  = { type: 'REQUEST_CONNECTION_PENDING', connection: ConnectionT }
  | { type: 'REQUEST_CONNECTION_SUCCESS', connectionId: string }
  | { type: 'REQUEST_CONNECTION_ERROR', connectionId: string, error: string }
  | { type: 'CONNECTION_CLOSED', connectionId: string }
  | { type: 'SEND_MESSAGE', connectionId: string, from: string, to: string, message: string }
  | { type: 'RECEIVE_DIRECT_MESSAGE', from: string, message: string }
  | { type: 'RECEIVE_CHANNEL_MESSAGE', channel: string, from: string, message: string }
  | { type: 'RECEIVE_AWAY', message: string, nick: string }
  | { type: 'RECEIVE_JOIN', channel: string, from: string }
  | { type: 'RECEIVE_MOTD', connectionId: string, motd: string }
  | { type: 'RECEIVE_NAMES', channel: string, names: Array<PersonT> }
  | { type: 'RECEIVE_NICK', oldNickname: string, newNickname: string }
  | { type: 'RECEIVE_NOTICE', connectionId: string, to: string, from: string, message: string }
  | { type: 'RECEIVE_PART', message: string, nick: string, channels: Array<string> }
  | { type: 'RECEIVE_QUIT', message: string, nick: string }
  | { type: 'RECEIVE_TOPIC', channel: string, topic: string }
  | { type: 'RECEIVE_WELCOME', connectionId: string, nick: string }
  | { type: 'COMMAND_JOIN', name: string }
  | { type: 'COMMAND_ME', target: string, message: string }
  | { type: 'COMMAND_NICK', newNickname: string }
  | { type: 'COMMAND_NOTICE', to: string, message: string }
  | { type: 'COMMAND_PART', channel: string }
  | { type: 'COMMAND_PART_ALL', channels: Array<string> }
  | { type: 'REDIRECT', route: RouteT }
  ;

export type Store = ReduxStore<IrcState, Action>;
export type GetState = () => IrcState;
// export type Dispatch = ReduxDispatch<Action>;
/* eslint-disable no-use-before-define */
export type Dispatchable = Action | Thunk | Array<Action>;
export type Dispatch = (action: Dispatchable) => any;
export type Thunk = (dispatch: Dispatch, getState: GetState) => void;
