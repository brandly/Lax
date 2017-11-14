import { combineReducers } from 'redux'
import { REQUEST_CONNECTION } from '../actions'

function list (state = [], { type, payload }) {
  switch (type) {
    case REQUEST_CONNECTION.PENDING:
      return state.concat([payload])
    default:
      return state
  }
}

export default combineReducers({
  list
})
