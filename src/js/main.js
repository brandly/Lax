import React from 'react'
import { render } from 'react-dom'
import { Router, Route } from 'react-router'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import loggerMiddleware from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { rootReducer } from './reducers'
import ConnectionCreator from './components/connection-creator'
import MessageCenter from './components/message-center'
import browserHistory from './modules/browser-history'

const initialState = {}
const middleware = [thunkMiddleware]
if (process.env.NODE_ENV !== 'production') middleware.push(loggerMiddleware)

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware.apply(null, middleware)
)

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={ConnectionCreator} />
      <Route path="/connection/:connectionId" component={MessageCenter} />
    </Router>
  </Provider>,
  document.getElementById('main')
)
