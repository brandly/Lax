// @flow
import { combineReducers } from 'redux'
import { darkMode } from 'electron-util'
import Persistor from '../modules/Persistor'
import type { Action } from '../flow'

const init = {
  isDark: darkMode.isEnabled,
  quitMessage: 'https://github.com/brandly/Lax'
}

function isDark(state: boolean = init.isDark, action: Action): boolean {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return !state
    default:
      return state
  }
}

function quitMessage(state: string = init.quitMessage, action: Action): string {
  switch (action.type) {
    case 'SET_QUIT_MSG':
      return action.message
    default:
      return state
  }
}

const persist = new Persistor('irc-settings', init)
export default persist.wrap(
  combineReducers({
    isDark,
    quitMessage
  })
)
