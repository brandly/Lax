import React from 'react'
import { connect } from 'react-redux'

import ChannelStore from '../stores/channel-store'

import ConnectionHeader from './connection-header'
import ChannelList from './channel-list'
import JoinChannel from './join-channel'

import Channel from './channel'

function getCurrentChannel () {
  return {
    channel: ChannelStore.getSelectedChannel()
  }
}

class MessageCenter extends React.Component {
  constructor (props) {
    super(props)
    this.state = getCurrentChannel()
  }

  componentWillMount () {
    ChannelStore.addChangeListener(this._onChange.bind(this))
  }

  _onChange () {
    this.setState(getCurrentChannel())
  }

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
        <Channel channel={this.state.channel} />
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
})(MessageCenter)

function getConnectionById (state, connectionId) {
  return state.connections.list.find(({ id }) => id === connectionId)
}
