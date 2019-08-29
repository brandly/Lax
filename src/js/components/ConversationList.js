// @flow
/* global $Shape */
import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import ChannelName from './ChannelName'
import sortBy from '../modules/sortBy'
import { getConversationsForConnection } from '../reducers/selectors'
import type { IrcState, ConversationT } from '../flow'

type Props = {
  onSelectConversation: string => void,
  conversations: Array<ConversationT>,
  selectedConversationId: ?string
}

const byName = sortBy(c => c.name)

class ConversationList extends React.Component<Props> {
  selectConversation(channelName) {
    this.props.onSelectConversation(channelName)
  }

  selectConversationAtIndex(i) {
    this.selectConversation(this.props.conversations[i].name)
  }

  conversationOrder(convo) {
    return convo.name
  }

  render() {
    const { conversations, selectedConversationId } = this.props

    return (
      <ul className="channel-list">
        {conversations.sort(byName).map((convo, i) => {
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
              <ChannelName name={name} unreadCount={unreadCount} />
              {unreadCount ? (
                <span className="unread-count">{unreadCount}</span>
              ) : null}
            </li>
          )
        })}
      </ul>
    )
  }
}

export default connect(
  (state: IrcState, ownProps): $Shape<Props> => {
    const { connectionId, selectedConversationId } = ownProps
    const conversations = getConversationsForConnection(state, connectionId)

    return {
      conversations,
      selectedConversationId
    }
  }
)(ConversationList)
