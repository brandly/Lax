// @flow
import Persistor from '../modules/Persistor'
import type { Action, CredentialsT } from '../flow'
type State = CredentialsT[]

export function credentialsToId({
  realName,
  server,
  port
}: CredentialsT): string {
  return `${realName}@${server}:${port}`
}

const persist: Persistor<State> = new Persistor('past-credentials', ([]: State))

function list(state: State, action: Action): State {
  switch (action.type) {
    case 'WORKING_CREDENTIALS': {
      if (action.remember) {
        const id = credentialsToId(action.credentials)

        const update = [action.credentials].concat(
          state.filter(cred => credentialsToId(cred) !== id)
        )
        return update
      } else {
        return state
      }
    }
    case 'FORGET_CREDENTIALS': {
      const { id } = action
      return state.filter(cred => credentialsToId(cred) !== id)
    }
    default:
      return state
  }
}

export default persist.wrap(list)
