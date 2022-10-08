import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import Router from './components/Router'

import type { IrcState } from './flow'
import { store } from './store'

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
