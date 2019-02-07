// @flow
import type { RouteT, Action } from '../flow'

export function connectionCreatorRoute(): RouteT {
  return {
    view: 'CONNECTION_CREATOR',
    state: {
      isConnecting: false,
      realName: '',
      nickname: '',
      server: '',
      port: '',
      password: '',
      rememberPassword: localStorage.rememberPassword === 'true' || false
    }
  }
}

function route(
  state: RouteT = connectionCreatorRoute(),
  action: Action
): RouteT {
  switch (action.type) {
    case 'REQUEST_CONNECTION_SUCCESS':
    case 'SELECT_CONVERSATION':
      return {
        view: 'CONNECTION',
        connectionId: action.connectionId
      }
    case 'NOTIFICATION_CLICK': {
      const { via } = action
      if (
        via.type === 'RECEIVE_DIRECT_MESSAGE' ||
        via.type === 'RECEIVE_CHANNEL_MESSAGE'
      ) {
        return {
          view: 'CONNECTION',
          connectionId: via.connectionId
        }
      } else {
        return state
      }
    }
    case 'REDIRECT':
      return action.route
    case 'CONNECTION_CREATOR_UPDATE': {
      if (state.view === 'CONNECTION_CREATOR') {
        return Object.assign({}, state, {
          state: Object.assign({}, state.state, action.update)
        })
      } else {
        return state
      }
    }
    case 'REQUEST_CONNECTION_PENDING': {
      if (state.view === 'CONNECTION_CREATOR') {
        return Object.assign({}, state, {
          state: Object.assign({}, state.state, { isConnecting: true })
        })
      } else {
        return state
      }
    }
    case 'REQUEST_CONNECTION_ERROR': {
      if (state.view === 'CONNECTION_CREATOR') {
        return Object.assign({}, state, {
          state: Object.assign({}, state.state, { isConnecting: false })
        })
      } else {
        return state
      }
    }
    default:
      return state
  }
}

export default route
