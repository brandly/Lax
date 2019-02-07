// @flow
import type { Action, CreatorState } from '../flow'
const { localStorage } = window

export function init(): CreatorState {
  const state = {
    isConnecting: false,
    rememberPassword: localStorage.rememberPassword === 'true' || false,
    credentials: {
      realName: '',
      nickname: '',
      server: '',
      port: '',
      password: ''
    }
  }

  return state
}

function creator(state: CreatorState = init(), action: Action): CreatorState {
  switch (action.type) {
    case 'CREDENTIALS_UPDATE': {
      return Object.assign({}, state, {
        credentials: Object.assign({}, state.credentials, action.update)
      })
    }
    case 'REQUEST_CONNECTION_PENDING': {
      return Object.assign({}, state, { isConnecting: true })
    }
    case 'REQUEST_CONNECTION_SUCCESS': {
      return Object.assign({}, state, {
        isConnecting: false,
        credentials: {
          realName: '',
          nickname: '',
          server: '',
          port: '',
          password: ''
        }
      })
    }
    case 'REQUEST_CONNECTION_ERROR': {
      return Object.assign({}, state, { isConnecting: false })
    }
    default:
      return state
  }
}

export default creator
