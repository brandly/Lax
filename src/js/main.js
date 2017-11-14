import React from 'react'
import { render } from 'react-dom'
import { Router, Route } from 'react-router'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import ConnectionCreator from './components/connection-creator'
import MessageCenter from './components/message-center'
import browserHistory from './modules/browser-history'

const store = createStore(
  (state = {}) => state,
  process.env.NODE_ENV === 'production' ? null : applyMiddleware(logger)
)

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={ConnectionCreator} />
      <Route path="/message-center" component={MessageCenter} />
    </Router>
  </Provider>,
  document.getElementById('main')
)
