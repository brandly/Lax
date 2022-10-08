import {
  getSelectedConversation,
  getConnectionById
} from '../reducers/selectors'
import type { Action } from '../flow'
import type { Store, AppDispatch } from '../store'
declare var Notification: any

const notifMiddleware =
  (store: Store) => (next: AppDispatch) => (action: Action) => {
    function fireNotif(from: string, body: string) {
      const notif = new Notification(from, {
        body
      })
      notif.addEventListener('click', () => {
        const dispatch: AppDispatch = store.dispatch
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

    if (action.type === 'RECEIVE_CHANNEL_MESSAGE') {
      const state = store.getState()
      const connection = getConnectionById(state, action.connectionId)

      if (
        connection &&
        action.message.toLowerCase().includes(connection.nickname.toLowerCase())
      ) {
        fireNotif(`${action.from} in ${action.channel}`, action.message)
      }
    } else if (action.type === 'RECEIVE_DIRECT_MESSAGE') {
      const state = store.getState()
      if (state.route.view !== 'CONNECTION')
        throw new Error('Must have connection to RECEIVE_DIRECT_MESSAGE')
      const currentConvo = getSelectedConversation(
        state,
        state.route.connectionId
      )

      if (
        state.route.view !== 'CONNECTION' ||
        (currentConvo && action.from !== currentConvo.name) ||
        !state.ui.visible
      ) {
        fireNotif(action.from, action.message)
      }
    }

    return next(action)
  }

export default notifMiddleware
