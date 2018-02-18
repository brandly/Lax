import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import loggerMiddleware from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { rootReducer } from './reducers'
import Router from './components/Router'
const inProduction = process.env.NODE_ENV === 'production'

const initialState = {}
const middleware = [thunkMiddleware]
const composeEnhancers =
  inProduction ? compose : (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)
if (!inProduction) middleware.push(loggerMiddleware)

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware.apply(null, middleware))
)

render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.getElementById('main')
)
