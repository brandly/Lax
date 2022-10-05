import type { RouteT, Action } from '../flow'

function route(
  state: RouteT = {
    view: 'CONNECTION_CREATOR'
  },
  action: Action
): RouteT {
  switch (action.type) {
    case 'REQUEST_CONNECTION_SUCCESS':
      return {
        view: 'CONNECTION',
        connectionId: action.connection.id
      }

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

    default:
      return state
  }
}

export default route
