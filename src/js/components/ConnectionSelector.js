// @flow
/* global $Shape */
import * as React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { Bulb } from './icons/Bulb'
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
              className="tab"
              style={{
                background: 'transparent',
                position: 'absolute',
                bottom: 8
              }}
            >
              <button
                className="icon-btn"
                onClick={e => {
                  e.stopPropagation()
                  dispatch({ type: 'REDIRECT', route: { view: 'SETTINGS' } })
                }}
              >
                <Bulb color="#373D48" />
              </button>
            </li>
          </ul>
        </div>
        <div className="connection-view">{children}</div>
      </React.Fragment>
    )
  }
}

const Tab = props => (
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

export default connect(
  (state: IrcState, ownProps): $Shape<Props> => {
    return {
      connections: state.connections.list,
      route: state.route
    }
  }
)(ConnectionSelector)
