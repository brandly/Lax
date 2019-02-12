// @flow
import React from 'react'
import type { ConnectionT } from '../flow'

type Props = {
  connection: ConnectionT,
  onClick: void => void
}

class ConnectionHeader extends React.Component<Props> {
  render() {
    const { connection, onClick } = this.props

    return (
      <div className="header connection-header">
        <h2
          className="vertical-center server"
          onClick={() => {
            onClick()
          }}
        >
          {connection.credentials.server}
        </h2>
      </div>
    )
  }
}

export default ConnectionHeader
