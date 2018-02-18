// @flow
/* global $Shape */
import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import {
  getConversationsForConnection
} from '../reducers/selectors'
import type { IrcState, ConversationT } from '../flow'

// TODO: probably refactor state tree to store list of convos on a per connection basis
type Props = {
  onSelectConversation: string => void,
  conversations: Array<ConversationT>,
  selectedConversationId: ?string
};

class ConversationList extends React.Component<Props> {
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

  // selectNextChannel () {
  //   const { channels, selectedChannel } = this.state
  //   if (!channels) return

  //   const currentIndex = channels.indexOf(selectedChannel)
  //   const nextIndex = (currentIndex + 1) % channels.size

  //   this.selectConversationAtIndex(nextIndex)
  // }

  // selectPrevChannel () {
  //   const { channels, selectedChannel } = this.state
  //   if (!channels) return

  //   const currentIndex = channels.indexOf(selectedChannel)
  //   const prevIndex = (currentIndex === 0) ? (channels.size - 1) : (currentIndex - 1)

  //   this.selectConversationAtIndex(prevIndex)
  // }

  conversationOrder (convo) {
    return convo.name
  }

  render () {
    const {
      conversations,
      selectedConversationId
    } = this.props

    // TODO: sort these
    return (
      <ul className="channel-list">
        {conversations.map((convo, i) => {
          const { name, unreadCount } = convo

          const classes = classNames({
            'channel-list-item': true,
            'is-selected': name === selectedConversationId
          })

          return (
            <li
              className={classes}
              key={name}
              onClick={this.selectConversation.bind(this, name)}
            >
              <span className="channel-name">{name}</span>
              { unreadCount ? <span className="unread-count">{unreadCount}</span> : null }
            </li>
          )
        })}
      </ul>
    )
  }
}

export default connect((state: IrcState, ownProps): $Shape<Props> => {
  const { connectionId, selectedConversationId } = ownProps
  const conversations = getConversationsForConnection(state, connectionId)

  return {
    conversations,
    selectedConversationId
  }
})(ConversationList)
