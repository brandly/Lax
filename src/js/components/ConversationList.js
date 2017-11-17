import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import {
  getConversationsForConnection
} from '../reducers/selectors'

// TODO: probably refactor state tree to store list of convos on a per connection basis

class ConversationList extends React.Component {
  componentWillMount () {
    // TODO: keyboard shortcuts
    // this.setKeymaster({
    //   '⌘+shift+]': this.selectNextChannel,
    //   '⌘+shift+[': this.selectPrevChannel
    // })
  }

  selectConversation (channelName) {
    this.props.onSelectConversation(channelName)
  }

  selectConversationAtIndex (i) {
    this.selectConversation(this.props.conversations[i].name)
  }

  selectNextChannel () {
    const { channels, selectedChannel } = this.state
    if (!channels) return

    const currentIndex = channels.indexOf(selectedChannel)
    const nextIndex = (currentIndex + 1) % channels.size

    this.selectConversationAtIndex(nextIndex)
  }

  selectPrevChannel () {
    const { channels, selectedChannel } = this.state
    if (!channels) return

    const currentIndex = channels.indexOf(selectedChannel)
    const prevIndex = (currentIndex === 0) ? (channels.size - 1) : (currentIndex - 1)

    this.selectConversationAtIndex(prevIndex)
  }

  conversationOrder (channel) {
    return channel.name
  }

  render () {
    const {
      conversations,
      selectedConversationId
    } = this.props

    // TODO: sort these
    return (
      <ul className="channel-list">
        {conversations.map((channel, i) => {
          const { name, unreadCount } = channel

          const classes = classNames({
            'channel-list-item': true,
            'is-selected': name === selectedConversationId
          })

          return (
            <li
              className={classes}
              key={channel.name}
              onClick={this.selectConversation.bind(this, channel.name)}
            >
              <span className="channel-name">{name}</span>
              {unreadCount ? <span className="unread-count">{unreadCount}</span> : null}
            </li>
          )
        })}
      </ul>
    )
  }
}

export default connect((state, ownProps) => {
  const { connectionId, selectedConversationId } = ownProps
  const conversations = getConversationsForConnection(state, connectionId)

  return {
    conversations,
    selectedConversationId
  }
})(ConversationList)
