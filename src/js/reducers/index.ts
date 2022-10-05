import { combineReducers } from 'redux'
import connections from './connections'
import creator from './creator'
import credentials from './credentials'
import route from './route'
import settings from './settings'
import ui from './ui'
import type { IrcState, Action } from '../flow'
type Root = (arg0: IrcState, arg1: Action) => IrcState
export const rootReducer: Root = combineReducers({
  connections,
  creator,
  credentials,
  route,
  settings,
  ui
})
