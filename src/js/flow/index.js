// @flow
import type { Dispatch as ReduxDispatch } from 'redux'

type Action = {
  type: string,
  payload: any
}

// TODO:
export type IrcState = any
export type Dispatch = ReduxDispatch<IrcState, Action>
export type Thunk = (Dispatch, () => IrcState) => void

export type ConnectionT = {
  id: string,
  server: string
}

export type ConversationT = {
  name: string
}
