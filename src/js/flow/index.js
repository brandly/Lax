// @flow
import type { Dispatch as ReduxDispatch } from 'redux'

type Action = {
  type: string,
  payload: any
}

// TODO:
type IrcState = any
type IrcDispatch = ReduxDispatch<IrcState, Action>
export type Thunk = (IrcDispatch, () => IrcState) => void
