// @flow
import { combineReducers } from 'redux'
import type { Action } from '../flow'

function visible (state: boolean = true, action: Action): boolean {
  switch (action.type) {
    case 'VISIBILITY_CHANGE':
      return action.visible
    default:
      return state
  }
}

function isDark (state: boolean = false, action: Action): boolean {
  switch (action.type) {
    default:
      return state
  }
}

export default combineReducers({
  visible,
  isDark
})
