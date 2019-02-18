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

const key = 'past-credentials'
function init(): State {
  if (key in localStorage) {
    try {
      return JSON.parse(localStorage[key])
    } catch (e) {
      if (e instanceof SyntaxError) {
        localStorage.removeItem(key)
        return []
      } else {
        throw e
      }
    }
  } else {
    return []
  }
}

function save(state: State): State {
  localStorage.setItem(key, JSON.stringify(state))
  return state
}

function list(state: State = init(), action: Action): State {
  switch (action.type) {
    case 'WORKING_CREDENTIALS': {
      const id = credentialsToId(action.credentials)

      const update = [action.credentials].concat(
        state.filter(cred => credentialsToId(cred) !== id)
      )
      return save(update)
    }
    case 'FORGET_CREDENTIALS': {
      const { id } = action
      return save(state.filter(cred => credentialsToId(cred) !== id))
    }
    default:
      return state
  }
}

export default list
