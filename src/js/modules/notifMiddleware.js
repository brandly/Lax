// @flow
import {
  getSelectedConversation
} from '../reducers/selectors'
import type {
  Store,
  Action,
  Dispatch
} from '../flow'
declare var Notification : any;

const notifMiddleware = (store: Store) => (next: Dispatch) => (action: Action) => {
  if (action.type === 'RECEIVE_DIRECT_MESSAGE') {
    const state = store.getState()
    const currentConvo = getSelectedConversation(state, state.route.connectionId)

    if (!state.route.view === 'CONNECTION' ||
       (currentConvo && action.from !== currentConvo.name) ||
       !state.ui.visible) {
      const notif = new Notification(action.from, {
        body: action.message
      })

      notif.addEventListener('click', () => {
        const dispatch: Dispatch = store.dispatch
        dispatch({
          type: 'NOTIFICATION_CLICK',
          via: action
        })
      })

      // TODO: track these on a per convo basis, close them when convo is selected
      setTimeout(() => {
        notif.close()
      }, 30 * 1000)
    }
  }
  return next(action)
}

export default notifMiddleware
