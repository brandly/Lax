import { $Shape } from 'utility-types'

/* global $Shape */
import * as React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import type { ConnectionT, RouteT, IrcState, Dispatch } from '../flow'
type Props = {
  connections: Array<ConnectionT>
  route: RouteT
  children: React.ReactNode
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
                  route: {
                    view: 'CONNECTION_CREATOR'
                  }
                })
              }}
            >
              +
            </Tab>
            <li
              className="tab tab-settings-link"
              style={{
                background: 'transparent'
              }}
            >
              <button
                className="icon-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  dispatch({
                    type: 'REDIRECT',
                    route: {
                      view: 'SETTINGS'
                    }
                  })
                }}
                style={{
                  padding: 4
                }}
              >
                <GearIcon color="#AAABAE" />
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
  <li
    className={classNames('tab', {
      selected: props.selected || false
    })}
  >
    <button
      onClick={() => {
        props.onClick()
      }}
    >
      {props.children}
    </button>
  </li>
)

// Gear by Thak Ka from the Noun Project
// https://thenounproject.com/search/?q=gear&i=3524099
const GearIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    stroke="transparent"
    fill={props.color}
    style={{
      display: 'block'
    }}
  >
    <path d="M11.998 7.591c-2.43 0-4.406 1.978-4.406 4.408s1.977 4.408 4.406 4.408c2.432 0 4.408-1.978 4.408-4.408s-1.976-4.408-4.408-4.408zm0 7.816c-1.879 0-3.406-1.529-3.406-3.408s1.527-3.408 3.406-3.408 3.408 1.529 3.408 3.408-1.529 3.408-3.408 3.408z" />
    <path d="M21.504 10.053l-1.307-.28a8.514 8.514 0 00-.828-1.995l.725-1.12c.311-.475.238-1.164-.164-1.57l-1.021-1.024c-.395-.386-1.105-.46-1.564-.161l-1.125.728a8.352 8.352 0 00-1.994-.827l-.277-1.307a1.295 1.295 0 00-1.227-.99h-1.443c-.57 0-1.107.436-1.227.991l-.279 1.304a8.444 8.444 0 00-1.996.828l-1.121-.727c-.465-.302-1.18-.227-1.568.164L4.066 5.089a1.294 1.294 0 00-.164 1.567l.727 1.122a8.452 8.452 0 00-.828 1.996l-1.305.278a1.29 1.29 0 00-.992 1.226l-.002 1.445c.004.568.439 1.105.994 1.223l1.305.279c.191.699.469 1.368.83 1.995l-.727 1.12c-.311.474-.24 1.162.162 1.57l1.023 1.023c.395.388 1.104.462 1.564.162l1.123-.728c.631.361 1.299.64 1.996.828l.279 1.303c.115.555.652.991 1.225.995h1.447a1.298 1.298 0 001.223-.992l.279-1.307a8.465 8.465 0 001.994-.828l1.119.726c.195.127.428.194.674.194.34 0 .666-.129.896-.357l1.025-1.022a1.3 1.3 0 00.16-1.565l-.727-1.123a8.48 8.48 0 00.828-1.995l1.303-.278c.555-.117.992-.654.994-1.226l.002-1.45a1.291 1.291 0 00-.989-1.217zm-.01 2.665c0 .101-.104.229-.201.25l-1.609.344a.5.5 0 00-.383.377 7.438 7.438 0 01-.945 2.275.501.501 0 00.004.537l.896 1.386c.055.083.037.247-.031.317l-1.018 1.018c-.068.066-.242.085-.322.034l-1.383-.896a.5.5 0 00-.535-.005 7.428 7.428 0 01-2.277.944.504.504 0 00-.377.383l-.344 1.611c-.021.097-.148.2-.25.201h-1.438c-.1 0-.23-.105-.25-.201l-.344-1.61a.502.502 0 00-.377-.383 7.426 7.426 0 01-2.277-.944.502.502 0 00-.537.004l-1.385.896c-.08.05-.252.031-.316-.032l-1.018-1.019c-.072-.072-.09-.235-.035-.319l.896-1.384a.501.501 0 00.004-.537 7.477 7.477 0 01-.945-2.276.5.5 0 00-.383-.376l-1.609-.346c-.098-.02-.201-.148-.203-.246l.002-1.443c0-.1.104-.227.201-.248l1.609-.344a.505.505 0 00.383-.376 7.45 7.45 0 01.945-2.277.495.495 0 00-.004-.536l-.896-1.386c-.054-.083-.037-.246.031-.315l1.021-1.021c.068-.065.238-.082.316-.031l1.385.896a.498.498 0 00.535.004 7.473 7.473 0 012.277-.944.504.504 0 00.377-.383l.344-1.611c.021-.098.148-.199.248-.199h1.443c.1 0 .227.104.248.2l.344 1.61a.504.504 0 00.377.383 7.45 7.45 0 012.275.943.494.494 0 00.535-.004l1.389-.896c.072-.05.252-.029.314.031l1.018 1.02c.072.072.09.236.033.32l-.895 1.383a.505.505 0 00-.004.537 7.48 7.48 0 01.945 2.276.497.497 0 00.383.376l1.611.346c.098.021.201.15.201.246l.001 1.44z" />
  </svg>
)

export default connect((state: IrcState, ownProps): $Shape<Props> => {
  return {
    connections: state.connections.list,
    route: state.route
  }
})(ConnectionSelector)
