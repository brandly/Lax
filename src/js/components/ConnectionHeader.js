// @flow
import React from 'react'
import type { ConnectionT } from '../flow'

type Props = {
  connection: ConnectionT
}

class ConnectionHeader extends React.Component<Props> {
  render () {
    const { connection } = this.props

    return (
      <div className="header connection-header">
        <h2 className="vertical-center server">{connection.server}</h2>
      </div>
    )
  }
}

export default ConnectionHeader
