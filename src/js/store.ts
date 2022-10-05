import { configureStore } from '@reduxjs/toolkit'
import { applyMiddleware, compose } from 'redux'
import notifMiddleware from './modules/notifMiddleware'
import storeChannelsMiddleware from './modules/storeChannels'
import { rootReducer } from './reducers'
import { Action } from './flow'

const inProduction = process.env.NODE_ENV === 'production'
const initialState = {}
const middleware = [notifMiddleware, storeChannelsMiddleware]
const composeEnhancers = inProduction
  ? compose
  : // wtf
    (
      window as unknown as {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose | undefined
      }
    ).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
if (!inProduction) middleware.push(require('redux-logger').default)

export const store = configureStore(
  {
    reducer: rootReducer
    // middleware: composeEnhancers(applyMiddleware.apply(null, middleware))
  }
  // , initialState
  // ,
)

export type Store = typeof store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export type GetState = typeof store.getState
export type Dispatchable = Parameters<AppDispatch>[0]
