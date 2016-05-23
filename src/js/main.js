import React from 'react'
import { render } from 'react-dom'
import { Router, Route } from 'react-router'
import ConnectionCreator from './components/connection-creator'
import MessageCenter from './components/message-center'
import browserHistory from './modules/browser-history'

render(
  <Router history={browserHistory}>
    <Route path="/" component={ConnectionCreator} />
    <Route path="/message-center" component={MessageCenter} />
  </Router>,
  document.getElementById('main')
)
