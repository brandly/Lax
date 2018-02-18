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
        connectionId: action.connectionId
      }
    default:
      return state
  }
}

export default route
