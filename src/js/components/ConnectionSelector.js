// @flow
/* global $Shape */
import * as React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import type { ConnectionT, RouteT, IrcState, Dispatch } from '../flow'

type Props = {
  connections: Array<ConnectionT>,
  route: RouteT,
  children: React.Node,
  dispatch: Dispatch
}

class ConnectionSelector extends React.PureComponent<Props> {
  render() {
    const { route, connections, children, dispatch } = this.props
    return (
      <React.Fragment>
        <div className="connection-tabs">
          <ul>
            {connections.map((conn, i) => (
              <Tab
                key={conn.id}
                selected={
                  route.view === 'CONNECTION' && route.connectionId === conn.id
                }
                onClick={() => {
                  dispatch({
                    type: 'SELECT_CONVERSATION',
                    connectionId: conn.id,
                    conversationId: conn.id
                  })
                }}
              >
                {i + 1}
              </Tab>
            ))}
            <Tab
              onClick={() => {
                dispatch({
                  type: 'REDIRECT',
                  route: { view: 'CONNECTION_CREATOR' }
                })
              }}
            >
              +
            </Tab>
            <li
              className="tab tab-settings-link"
              style={{ background: 'transparent' }}
            >
              <button
                className="icon-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  dispatch({ type: 'REDIRECT', route: { view: 'SETTINGS' } })
                }}
              >
                <SettingsIcon color="#AAABAE" />
              </button>
            </li>
          </ul>
        </div>
        <div className="connection-view">{children}</div>
      </React.Fragment>
    )
  }
}

const Tab = (props) => (
  <li className={classNames('tab', { selected: props.selected || false })}>
    <button
      onClick={() => {
        props.onClick()
      }}
    >
      {props.children}
    </button>
  </li>
)

// Settings by Focus from the Noun Project
// https://thenounproject.com/term/settings/943929
const SettingsIcon = (props) => (
  <svg viewBox="0 0 100 100" stroke={props.color} fill={props.color}>
    <path d="M85.1 46.3h-7.6c-1.6-5.6-6.7-9.7-12.7-9.7S53.7 40.8 52 46.3H14.9c-2 0-3.7 1.6-3.7 3.7 0 2 1.6 3.7 3.7 3.7H52c1.6 5.6 6.7 9.7 12.7 9.7s11.1-4.1 12.7-9.7H85c2 0 3.7-1.6 3.7-3.7.1-2-1.5-3.7-3.6-3.7zM64.8 56c-3.2 0-6-2.6-6-6s2.6-6 6-6 6 2.6 6 6-2.8 6-6 6zM14.9 24.4h7.9c1.6 5.6 6.7 9.7 12.7 9.7s11.1-4.1 12.7-9.7h36.9c2 0 3.7-1.6 3.7-3.7S87.2 17 85.1 17H48.2c-1.6-5.6-6.7-9.7-12.7-9.7S24.4 11.4 22.8 17h-7.9c-2 0-3.7 1.6-3.7 3.7s1.6 3.7 3.7 3.7zm20.6-9.7c3.2 0 6 2.6 6 6s-2.6 6-6 6-6-2.8-6-6 2.8-6 6-6zM85.1 75.6H48.2c-1.6-5.6-6.7-9.7-12.7-9.7S24.4 70 22.8 75.6h-7.9c-2 0-3.7 1.6-3.7 3.7s1.6 3.7 3.7 3.7h7.9c1.6 5.6 6.7 9.7 12.7 9.7s11.1-4.1 12.7-9.7h36.9c2 0 3.7-1.6 3.7-3.7s-1.6-3.7-3.7-3.7zm-49.6 9.7c-3.2 0-6-2.6-6-6s2.6-6 6-6 6 2.6 6 6-2.8 6-6 6z" />
  </svg>
)

export default connect((state: IrcState, ownProps): $Shape<Props> => {
  return {
    connections: state.connections.list,
    route: state.route
  }
})(ConnectionSelector)
