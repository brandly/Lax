import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import classNames from 'classnames'
import ChannelName from './ChannelName'
import sortBy from '../modules/sortBy'
import { getConversationsForConnection } from '../reducers/selectors'
import type { IrcState, ConversationT } from '../flow'

type OwnProps = {
  connectionId: string
  selectedConversationId: string | null
  onSelectConversation: (channelName: string) => void
}

const connector = connect((state: IrcState, ownProps: OwnProps) => {
  const { connectionId } = ownProps
  const conversations = getConversationsForConnection(state, connectionId)
  return {
    conversations
  }
})
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps
const byName = sortBy((c: ConversationT) => c.name)

class ConversationList extends React.Component<Props> {
  selectConversation(channelName: string) {
    this.props.onSelectConversation(channelName)
  }

  selectConversationAtIndex(i: number) {
    this.selectConversation(this.props.conversations[i].name)
  }

  conversationOrder(convo: ConversationT) {
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

export default connector(ConversationList)
