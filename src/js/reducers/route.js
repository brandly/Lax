// @flow
import type { RouteT, Action } from '../flow'

function route (
  state: RouteT = { view: 'CONNECTION_CREATOR' },
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
      if (action.via.type === 'RECEIVE_DIRECT_MESSAGE') {
        const { via } = action
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
    default:
      return state
  }
}

export default route
