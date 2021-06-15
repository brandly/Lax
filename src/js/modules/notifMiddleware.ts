import { getSelectedConversation, getConnectionById } from "../reducers/selectors";
import type { Store, Action, Dispatch } from "../flow";
declare var Notification: any;

const notifMiddleware = (store: Store) => (next: Dispatch) => (action: Action) => {
  function fireNotif(from, body) {
    const notif = new Notification(from, {
      body
    });
    notif.addEventListener('click', () => {
      const dispatch: Dispatch = store.dispatch;
      dispatch({
        type: 'NOTIFICATION_CLICK',
        via: action
      });
    });
    // TODO: track these on a per convo basis, close them when convo is selected
    setTimeout(() => {
      notif.close();
    }, 30 * 1000);
  }

  if (action.type === 'RECEIVE_CHANNEL_MESSAGE') {
    const state = store.getState();
    const connection = getConnectionById(state, action.connectionId);

    if (connection && action.message.toLowerCase().includes(connection.nickname.toLowerCase())) {
      fireNotif(`${action.from} in ${action.channel}`, action.message);
    }
  } else if (action.type === 'RECEIVE_DIRECT_MESSAGE') {
    const state = store.getState();
    const currentConvo = getSelectedConversation(state, state.route.connectionId);

    if (!state.route.view === 'CONNECTION' || currentConvo && action.from !== currentConvo.name || !state.ui.visible) {
      fireNotif(action.from, action.message);
    }
  }

  return next(action);
};

export default notifMiddleware;