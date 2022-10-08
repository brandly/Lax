import { combineReducers } from 'redux'
import connections from './connections'
import creator from './creator'
import credentials from './credentials'
import route from './route'
import settings from './settings'
import ui from './ui'
import type { IrcState, Action } from '../flow'

export const rootReducer = combineReducers({
  connections,
  creator,
  credentials,
  route,
  settings,
  ui
})
