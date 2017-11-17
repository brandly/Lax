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
