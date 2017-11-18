// @flow
import type { Dispatch as ReduxDispatch } from 'redux'

export type Action = {
  type: string,
  payload: any
};

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

export type Dispatch = ReduxDispatch<IrcState, Action>;
export type Thunk = (Dispatch, () => IrcState) => void;
