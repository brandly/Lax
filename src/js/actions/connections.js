import { createActionSet } from '../modules/createActionSet'

export const REQUEST_CONNECTION = createActionSet('REQUEST_CONNECTION')

export const connectToServer = ({ realName, nickname, password, server, port }) => {
  return dispatch => {
    const id = `${realName}@${server}:${port}`

    dispatch({ type: REQUEST_CONNECTION.PENDING, payload: { id } })

    // TODO: reach out to server
  }
}
