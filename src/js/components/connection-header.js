import React from 'react'

class ConnectionHeader extends React.Component {
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
