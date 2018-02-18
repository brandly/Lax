// @flow
import type { RouteT, Action } from '../flow'

function route (
  state: RouteT = { view: 'CONNECTION_CREATOR' },
  action: Action
): RouteT {
  switch (action.type) {
    case 'REQUEST_CONNECTION_SUCCESS':
      return {
        view: 'CONNECTION',
        connectionId: action.connectionId,
        conversationId: undefined
      }
    case 'RECEIVE_NAMES': {
      if (state.view === 'CONNECTION') {
        return {
          view: 'CONNECTION',
          connectionId: state.connectionId,
          conversationId: action.channel
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
