// @flow
import type {
  Store as ReduxStore
  // Dispatch as ReduxDispatch
} from 'redux'
import SelectList from '../modules/SelectList'

type IrcConnectionStream = {
  join: string => void,
  nick: string => void,
  send: (to: string, msg: string) => void,
  notice: (string, string) => void,
  action: (target: string, msg: string) => void,
  part: (channel: Array<string>) => void,
  quit: (msg: string) => void
}

export type PersonT = {
  name: string,
  mode: string
}

type MessageType =
  | 'notice'
  | 'priv'
  | 'action'
  | 'motd'
  | 'welcome'
  | 'topic'
  | 'flow'
  | 'join'
  | 'away'
  | 'part'
  | 'quit'
  | 'error'

export type MessageT = {
  id: string,
  type: MessageType,
  text: string,
  from: string,
  to: string,
  when: Date
}

export type ConversationType = 'CHANNEL' | 'DIRECT' | 'CONNECTION'

export type ConversationT = {
  type: ConversationType,
  name: string,
  messages: Array<MessageT>,
  people: Array<PersonT>,
  receivedJoin: boolean,
  unreadCount: number
}

export type ConnectionT = {
  id: string,
  isConnected: boolean,
  isWelcome: boolean,
  nickname: string,
  realName: string,
  server: string,
  port: number,
  stream: IrcConnectionStream,
  error: ?string,
  conversations: ?SelectList<ConversationT>
}

export type CredentialsT = {
  realName: string,
  nickname: string,
  server: string,
  port: number,
  password: string
}

export type CreatorState = {
  isConnecting: boolean,
  rememberPassword: boolean,
  credentials: CredentialsT,
  connection: ?ConnectionT,
  error: ?string
}

export type RouteT =
  | { view: 'CONNECTION_CREATOR' }
  | { view: 'CONNECTION', connectionId: string }
  | { view: 'SETTINGS' }

export type IrcState = {
  creator: CreatorState,
  connections: {
    list: Array<ConnectionT>
  },
  route: RouteT,
  ui: {
    visible: boolean,
    isDark: boolean,
    quitMsg: string
  }
}

export type Action =
  | { type: 'REQUEST_CONNECTION_PENDING', connection: ConnectionT }
  | { type: 'REQUEST_CONNECTION_SUCCESS', connection: ConnectionT }
  | { type: 'REQUEST_CONNECTION_ERROR', connectionId: string, error: string }
  | { type: 'CONNECTION_CLOSED', connectionId: string }
  | { type: 'IRC_ERROR', connectionId: string, message: string }
  | { type: 'WORKING_CREDENTIALS', credentials: CredentialsT }
  | { type: 'FORGET_CREDENTIALS', id: string }
  | {
      type: 'SEND_MESSAGE',
      connectionId: string,
      from: string,
      to: string,
      message: string
    }
  | {
      type: 'RECEIVE_ACTION',
      connectionId: string,
      channel: string,
      from: string,
      message: string
    }
  | {
      type: 'RECEIVE_DIRECT_MESSAGE',
      connectionId: string,
      from: string,
      message: string
    }
  | {
      type: 'RECEIVE_CHANNEL_MESSAGE',
      connectionId: string,
      channel: string,
      from: string,
      message: string
    }
  | {
      type: 'RECEIVE_AWAY',
      connectionId: string,
      message: string,
      nick: string
    }
  | {
      type: 'RECEIVE_JOIN',
      connectionId: string,
      channel: string,
      from: string
    }
  | { type: 'RECEIVE_MOTD', connectionId: string, motd: string }
  | {
      type: 'RECEIVE_NAMES',
      connectionId: string,
      channel: string,
      names: Array<PersonT>
    }
  | {
      type: 'RECEIVE_NICK',
      connectionId: string,
      oldNickname: string,
      newNickname: string
    }
  | {
      type: 'RECEIVE_NOTICE',
      connectionId: string,
      to: string,
      from: string,
      message: string
    }
  | {
      type: 'RECEIVE_PART',
      connectionId: string,
      message: string,
      nick: string,
      channels: Array<string>
    }
  | {
      type: 'RECEIVE_QUIT',
      connectionId: string,
      message: string,
      nick: string
    }
  | {
      type: 'RECEIVE_TOPIC',
      connectionId: string,
      channel: string,
      topic: string
    }
  | { type: 'RECEIVE_WELCOME', connectionId: string, nick: string }
  | { type: 'COMMAND_JOIN', connectionId: string, name: string }
  | {
      type: 'COMMAND_ME',
      connectionId: string,
      target: string,
      message: string
    }
  | { type: 'COMMAND_NICK', connectionId: string, newNickname: string }
  | {
      type: 'COMMAND_NOTICE',
      connectionId: string,
      to: string,
      message: string
    }
  | { type: 'COMMAND_PART', connectionId: string, channel: string }
  | { type: 'COMMAND_PART_ALL', connectionId: string, channels: Array<string> }
  | {
      type: 'SELECT_CONVERSATION',
      connectionId: string,
      conversationId: string
    }
  | { type: 'REDIRECT', route: RouteT }
  | { type: 'VISIBILITY_CHANGE', visible: boolean }
  | { type: 'TOGGLE_THEME' }
  | { type: 'NOTIFICATION_CLICK', via: Action }
  | { type: 'CREDENTIALS_UPDATE', update: $Shape<CredentialsT> }

export type Store = ReduxStore<IrcState, Action>
export type GetState = () => IrcState
// export type Dispatch = ReduxDispatch<Action>;
/* eslint-disable no-use-before-define */
export type Dispatchable = Action | Thunk | Array<Action>
export type Dispatch = (action: Dispatchable) => any
export type Thunk = (dispatch: Dispatch, getState: GetState) => void
