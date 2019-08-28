// @flow
import { combineReducers } from 'redux'
import { darkMode } from 'electron-util'
import type { Action } from '../flow'

function visible(state: boolean = true, action: Action): boolean {
  switch (action.type) {
    case 'VISIBILITY_CHANGE':
      return action.visible
    default:
      return state
  }
}

function isDark(state: boolean = darkMode.isEnabled, action: Action): boolean {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return !state
    default:
      return state
  }
}

export default combineReducers({
  visible,
  isDark
})
