// @flow
import type { Action, CredentialsT } from '../flow'
type State = CredentialsT[]
const { localStorage } = window

export function credentialsToId({
  realName,
  server,
  port
}: CredentialsT): string {
  return `${realName}@${server}:${port}`
}

class Persistor<A> {
  key: string
  default: A

  constructor(key: string, def: A) {
    this.key = key
    this.default = def
  }

  init(): A {
    if (this.key in localStorage) {
      try {
        return JSON.parse(localStorage[this.key])
      } catch (e) {
        if (e instanceof SyntaxError) {
          localStorage.removeItem(this.key)
          return this.default
        } else {
          throw e
        }
      }
    } else {
      return this.default
    }
  }

  wrap(reducer: (state: A, action: Action) => A) {
    return (state: A, action: Action) => {
      const after = reducer(state || this.init(), action)
      if (typeof after !== 'undefined' && state !== after) {
        localStorage.setItem(this.key, JSON.stringify(after))
      }
      return after
    }
  }
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
