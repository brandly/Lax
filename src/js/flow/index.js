// @flow
import type { Dispatch as ReduxDispatch } from 'redux'

type IrcConnectionStream = {
  join: string => void,
  nick: string => void
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
  | 'part'
  | 'quit'
  | 'join'
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
  people: Array<PersonT>
};

export type IrcState = {
  conversations: {
    list: Array<ConversationT>
  },
  connections: {
    list: Array<ConnectionT>
  }
};

export type Action
  = { type: 'REQUEST_CONNECTION_PENDING', connection: ConnectionT }
  | { type: 'REQUEST_CONNECTION_SUCCESS', connection: ConnectionT }
  | { type: 'REQUEST_CONNECTION_ERROR', connection: ConnectionT, error: string }
  | { type: 'RECEIVE_DIRECT_MESSAGE', from: string, message: string }
  | { type: 'RECEIVE_CHANNEL_MESSAGE', channel: string, from: string, message: string }
  | { type: 'RECEIVE_JOIN', channel: string, from: string }
  | { type: 'RECEIVE_MOTD', connectionId: string, motd: string }
  | { type: 'RECEIVE_NAMES', channel: string, names: Array<PersonT> }
  | { type: 'RECEIVE_NOTICE', connectionId: string, to: string, from: string, message: string }
  | { type: 'RECEIVE_PART', message: string, nick: string }
  | { type: 'RECEIVE_QUIT', message: string, nick: string }
  | { type: 'RECEIVE_TOPIC', channel: string, topic: string }
  | { type: 'RECEIVE_WELCOME', connectionId: string, nick: string }
  | { type: 'COMMAND_JOIN', name: string }
  ;

export type Dispatch = ReduxDispatch<IrcState, Action>;
export type Thunk = (Dispatch, () => IrcState) => void;
