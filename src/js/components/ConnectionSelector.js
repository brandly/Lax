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
      <div>
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
                  dispatch({ type: 'TOGGLE_THEME' })
                }}
              >
                <Bulb color="#373D48" />
              </button>
            </li>
          </ul>
        </div>
        <div className="connection-view">{children}</div>
      </div>
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

// Created by Jens Tärning from the Noun Project
// https://thenounproject.com/term/light-bulb/9628/
const Bulb = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    x="0px"
    y="0px"
    viewBox="0 0 100 100"
    enableBackground="new 0 0 100 100"
    stroke={props.color}
    fill={props.color}
  >
    <path d="M39.899,94c1.951,3.574,5.742,6,10.101,6s8.149-2.426,10.101-6H39.899z" />
    <path d="M61,75c2,0,4-2,4-4c0-17,15-19.309,15-41C80,13.431,66.568,0,50,0C33.431,0,20,13.431,20,30c0,21.691,15,24,15,41  c0,2,2,4,4,4H61z" />
    <path d="M63,80.5c0,1.375-1.125,2.5-2.5,2.5h-21c-1.375,0-2.5-1.125-2.5-2.5l0,0c0-1.375,1.125-2.5,2.5-2.5h21  C61.875,78,63,79.125,63,80.5L63,80.5z" />
    <path d="M63,88.5c0,1.375-1.125,2.5-2.5,2.5h-21c-1.375,0-2.5-1.125-2.5-2.5l0,0c0-1.375,1.125-2.5,2.5-2.5h21  C61.875,86,63,87.125,63,88.5L63,88.5z" />
  </svg>
)

export default connect(
  (state: IrcState, ownProps): $Shape<Props> => {
    return {
      connections: state.connections.list,
      route: state.route
    }
  }
)(ConnectionSelector)
