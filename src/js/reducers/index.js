// @flow
import { combineReducers } from 'redux'
import creator from './creator'
import connections from './connections'
import route from './route'
import ui from './ui'
import type { IrcState, Action } from '../flow'

type Root = (IrcState, Action) => IrcState

export const rootReducer: Root = combineReducers({
  creator,
  connections,
  route,
  ui
})
