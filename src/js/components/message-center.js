import React from 'react'

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
    return (
      <div className="message-center">
        <div className="left-panel">
          <ConnectionHeader />
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

export default MessageCenter
