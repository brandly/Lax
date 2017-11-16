import { combineReducers } from 'redux'
import connections from './connections'
import conversations from './conversations'

export const rootReducer = combineReducers({
  connections,
  conversations
})
