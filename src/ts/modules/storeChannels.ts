// for each connection, we want a list of channels
// this heavily mirrors our conversations reducer, just filter out DMs
// store the channel names on a per-connection-id basis
// when connection is first established (is that a "welcome"? or what?),
//   fire a series of JOINs
import { getConversationsForConnection } from '../reducers/selectors'
import { commandJoin } from '../actions'
import type { Store, Action } from '../flow'
import { AppDispatch } from '../store'
declare var Notification: any

const key = (id: string) => `channels-${id}`

function write(id: string, list: Array<string>): void {
  window.localStorage[key(id)] = JSON.stringify(list)
}

function read(id: string): Array<string> {
  const raw = window.localStorage[key(id)]
  return raw ? JSON.parse(raw) : []
}

const storeChannelsMiddleware =
  (store: Store) => (next: AppDispatch) => (action: Action) => {
    if ('connectionId' in action) {
      const connectionId = action.connectionId || ''

      const get = () =>
        getConversationsForConnection(store.getState(), connectionId).filter(
          (convo) => convo.type === 'CHANNEL'
        )

      const before = get()
      next(action)
      const after = get()

      if (after.length !== before.length) {
        const names = after.map((convo) => convo.name)
        write(connectionId, names)
      }

      if (action.type === 'RECEIVE_WELCOME') {
        const dispatch: AppDispatch = store.dispatch
        read(connectionId).forEach((name) => {
          setTimeout(() => {
            dispatch(commandJoin(connectionId, [name]))
          })
        })
      }
    } else {
      return next(action)
    }
  }

export default storeChannelsMiddleware
