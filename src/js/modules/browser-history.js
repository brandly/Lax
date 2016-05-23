import path from 'path'
import { useRouterHistory } from 'react-router'
import { createHistory } from 'history'
import pkg from '../../../package'

const browserHistory = useRouterHistory(createHistory)({
  basename: path.resolve(pkg['main-html'])
})

export default browserHistory
