import type { Action, CreatorState } from '../flow'
const defaultCreds = {
  realName: '',
  nickname: '',
  server: '',
  port: 6667,
  password: ''
}
// TODO: call this LoginState
export function init(): CreatorState {
  return {
    isConnecting: false,
    credentials: defaultCreds,
    connection: null,
    error: null
  }
}

function creator(state: CreatorState = init(), action: Action): CreatorState {
  switch (action.type) {
    case 'CREDENTIALS_UPDATE': {
      return {
        ...state,
        credentials: { ...state.credentials, ...action.update }
      }
    }

    case 'REQUEST_CONNECTION_PENDING': {
      return {
        ...state,
        isConnecting: true,
        error: null,
        connection: action.connection
      }
    }

    case 'REQUEST_CONNECTION_SUCCESS': {
      return {
        ...state,
        isConnecting: false,
        connection: null,
        error: null,
        credentials: defaultCreds
      }
    }

    case 'REQUEST_CONNECTION_ERROR': {
      return { ...state, isConnecting: false, error: action.error }
    }

    case 'CONNECTION_CLOSED': {
      if (state.connection && action.connectionId === state.connection.id) {
        return {
          ...state,
          connection: { ...state.connection, isConnected: false }
        }
      } else {
        return state
      }
    }

    default:
      return state
  }
}

export default creator
