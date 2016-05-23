import path from 'path'
import IRC from './components/irc'
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, useRouterHistory } from 'react-router'
import { createHistory } from 'history'
import pkg from '../../package'

const browserHistory = useRouterHistory(createHistory)({
  basename: path.resolve(pkg['main-html'])
})

render(
  <Router history={browserHistory}>
    <Route path="/" component={IRC}></Route>
  </Router>,
  document.getElementById('main')
)
