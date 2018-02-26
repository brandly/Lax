// @flow
/* global $Shape */
import * as React from 'react'
import { connect } from 'react-redux'
import type {
  ConnectionT,
  IrcState,
  Dispatch
} from '../flow'

type Props = {
  connections: Array<ConnectionT>,
  children: React.Node,
  dispatch: Dispatch
};

class ConnectionSelector extends React.PureComponent<Props> {
  render () {
    const { connections, children, dispatch } = this.props
    return (
      <div>
        <div className="connection-tabs">
          <ul>
            {connections.map((conn, i) =>
                <Tab onClick={() => {
                  dispatch({
                    type: 'SELECT_CONVERSATION',
                    connectionId: conn.id,
                    conversationId: conn.id
                  })
                }}>{i + 1}</Tab>
            )}
            <Tab onClick={() => {
              dispatch({
                type: 'REDIRECT',
                route: { view: 'CONNECTION_CREATOR' }
              })
            }}>+</Tab>
          </ul>
        </div>
        <div className="connection-view">{children}</div>
      </div>
    )
  }
}

const Tab = props =>
  <li className="tab">
    <button
      onClick={() => {
        props.onClick()
      }}
    >{props.children}</button>
  </li>

export default connect((state: IrcState, ownProps): $Shape<Props> => {
  return {
    connections: state.connections.list
  }
})(ConnectionSelector)
