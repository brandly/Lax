// @flow
/* global $Shape */
import React from 'react'
import { connect } from 'react-redux'
import ConnectionHeader from './ConnectionHeader'
import ConversationList from './ConversationList'
import JoinConversation from './JoinConversation'
import Conversation from './Conversation'
import { getConnectionById } from '../reducers/selectors'
import { commandJoin, createMessage } from '../actions'
import type { Dispatch, IrcState, ConnectionT, ConversationT } from '../flow'

type Props = {
  dispatch: Dispatch,
  connection: ?ConnectionT,
  conversation: ?ConversationT
}

class Connection extends React.Component<Props> {
  viewConversation(conversationId) {
    const { dispatch, connection } = this.props

    dispatch({
      type: 'SELECT_CONVERSATION',
      connectionId: connection ? connection.id : '',
      conversationId
    })
  }

  render() {
    const { connection, conversation, dispatch } = this.props

    if (!connection) return <h1>Unexpected: No connection found</h1>

    return (
      <div className="message-center">
        <div className="left-panel">
          <ConnectionHeader
            connection={connection}
            onClick={() => {
              this.viewConversation(connection.id)
            }}
          />
          {connection.isWelcome ? (
            <div className="below-header scrolling-panel">
              <h3 className="channel-list-heading">Conversations</h3>
              <ConversationList
                connectionId={connection.id}
                onSelectConversation={name => {
                  this.viewConversation(name)
                }}
                selectedConversationId={conversation && conversation.name}
              />
              <JoinConversation
                onJoin={name => {
                  dispatch(commandJoin(connection.id, name))
                  this.viewConversation(name)
                }}
              />
            </div>
          ) : null}
        </div>
        {conversation ? (
          <Conversation
            nickname={connection.nickname}
            conversation={conversation}
            onMessage={message => {
              dispatch(
                createMessage({
                  connectionId: connection.id,
                  conversationName: conversation.name,
                  message
                })
              )
            }}
            disconnected={!connection.isConnected}
          />
        ) : null}
      </div>
    )
  }
}

export default connect(
  (state: IrcState, ownProps): $Shape<Props> => {
    if (state.route.view !== 'CONNECTION') throw new Error()
    const { connectionId } = state.route

    const connection = getConnectionById(state, connectionId)
    const conversation =
      connection && connection.conversations
        ? connection.conversations.getSelected()
        : null

    return {
      connection,
      conversation
    }
  }
)(Connection)
