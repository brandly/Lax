// @flow
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import type { Store as ReduxStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { rootReducer } from './reducers'
import Router from './components/Router'
import notifMiddleware from './modules/notifMiddleware'
import storeChannelsMiddleware from './modules/storeChannels'
import type { IrcState } from './flow'
const inProduction = process.env.NODE_ENV === 'production'

const initialState = {}
const middleware = [thunkMiddleware, notifMiddleware, storeChannelsMiddleware]
const composeEnhancers = inProduction
  ? compose
  : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
if (!inProduction) middleware.push(require('redux-logger').default)

const store: ReduxStore = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware.apply(null, middleware))
)

window.addEventListener('beforeunload', () => {
  const state: IrcState = store.getState()
  state.connections.list.map((conn) => {
    conn.stream.quit(state.settings.quitMessage)
  })
})

const el = document.getElementById('main')
if (el) {
  render(
    <Provider store={store}>
      <Router />
    </Provider>,
    el
  )
} else {
  console.error("Couldn't find element to mount to.")
}
