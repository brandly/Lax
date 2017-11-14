import React from 'react'
import Immutable from 'immutable'
import classNames from 'classnames'

import ChannelStore from '../stores/channel-store'
import ChannelActions from '../actions/channel-actions'

class ChannelList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      channels: Immutable.List(),
      selectedChannel: {}
    }
  }

  componentWillMount () {
    ChannelStore.addChangeListener(this._onChange.bind(this))
    // TODO:
    // this.setKeymaster({
    //   '⌘+shift+]': this.selectNextChannel,
    //   '⌘+shift+[': this.selectPrevChannel
    // })
  }

  _onChange () {
    const channels = ChannelStore.getChannels()

    this.setState({
      channels: channels.sortBy(this.channelOrder),
      selectedChannel: ChannelStore.getSelectedChannel() || {}
    })
  }

  selectChannel (channelName) {
    ChannelActions.selectChannel({ channelName })
  }

  selectChannelAtIndex (i) {
    this.selectChannel(this.state.channels.get(i).name)
  }

  selectNextChannel () {
    const { channels, selectedChannel } = this.state
    if (!channels) return

    const currentIndex = channels.indexOf(selectedChannel)
    const nextIndex = (currentIndex + 1) % channels.size

    this.selectChannelAtIndex(nextIndex)
  }

  selectPrevChannel () {
    const { channels, selectedChannel } = this.state
    if (!channels) return

    const currentIndex = channels.indexOf(selectedChannel)
    const prevIndex = (currentIndex === 0) ? (channels.size - 1) : (currentIndex - 1)

    this.selectChannelAtIndex(prevIndex)
  }

  channelOrder (channel) {
    return channel.name
  }

  render () {
    const channelElements = this.state.channels.map((channel, i) => {
      const { name, unreadCount } = channel

      const classes = classNames({
        'channel-list-item': true,
        'is-selected': name === this.state.selectedChannel.name
      })

      const nameEl = <span className="channel-name">{name}</span>
      const countEl = unreadCount ? <span className="unread-count">{unreadCount}</span> : null

      return (
        <li className={classes}
            key={channel.name}
            onClick={this.selectChannel.bind(this, channel.name)}>{nameEl}{countEl}</li>
      )
    })

    return (
      <ul className="channel-list">
        {channelElements.toArray()}
      </ul>
    )
  }
}

export default ChannelList
