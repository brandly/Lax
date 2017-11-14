import React from 'react'
import ConnectionStore from '../stores/connection-store'

function getServer () {
  return {
    server: ConnectionStore.server
  }
}

class ConnectionHeader extends React.Component {
  constructor (props) {
    super(props)
    this.state = getServer()
  }

  componentWillMount () {
    ConnectionStore.addChangeListener(this._onChange.bind(this))
  }

  _onChange () {
    this.setState(getServer())
  }

  render () {
    return (
      <div className="header connection-header">
        <h2 className="vertical-center server">{this.state.server}</h2>
      </div>
    )
  }
}

export default ConnectionHeader
