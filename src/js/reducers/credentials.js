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
      if (state.map(credentialsToId).includes(id)) {
        return state
      } else {
        return save(state.concat(action.credentials))
      }
    }
    default:
      return state
  }
}

export default list
