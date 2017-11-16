import React from 'react'
import { connect } from 'react-redux'
import ConnectionHeader from './ConnectionHeader'
import ChannelList from './channel-list'
import JoinChannel from './join-channel'
// import Channel from './channel'

class Connection extends React.Component {
  render () {
    const {
      connection
    } = this.props

    return (
      <div className="message-center">
        <div className="left-panel">
          <ConnectionHeader
            connection={connection}
          />
          <div className="below-header scrolling-panel">
            <ChannelList />
            <JoinChannel />
          </div>
        </div>
        {/* <Channel channel={this.state.channel} /> */}
      </div>
    )
  }
}

export default connect((state, ownProps) => {
  const { connectionId } = ownProps.params
  const connection = getConnectionById(state, connectionId)

  return {
    connection
  }
})(Connection)

function getConnectionById (state, connectionId) {
  return state.connections.list.find(({ id }) => id === connectionId)
}
