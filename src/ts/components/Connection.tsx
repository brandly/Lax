import React from 'react'
import { ConnectedProps, connect } from 'react-redux'
import ConnectionHeader from './ConnectionHeader'
import ConversationList from './ConversationList'
import JoinConversation from './JoinConversation'
import Conversation from './Conversation'
import { getConnectionById } from '../reducers/selectors'
import { commandJoin, createMessage } from '../actions'
import type { IrcState, ConnectionT, ConversationT } from '../flow'

const connector = connect((state: IrcState) => {
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
})

type Props = ConnectedProps<typeof connector>

class Connection extends React.Component<Props> {
  viewConversation(conversationId: string) {
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
      <div className="container">
        <div className="left-panel conversation-list">
          <ConnectionHeader
            connection={connection}
            onClick={() => {
              this.viewConversation(connection.id)
            }}
          />
          {connection.isWelcome ? (
            <div className="below-header scrolling-panel">
              <h3 className="channel-list-heading">Conversations</h3>
              {/* TODO: ConversationList should take a SelectList for conversations */}
              <ConversationList
                connectionId={connection.id}
                onSelectConversation={(name) => {
                  this.viewConversation(name)
                }}
                selectedConversationId={conversation && conversation.name}
              />
              <JoinConversation
                onJoin={(name) => {
                  dispatch(commandJoin(connection.id, [name]))
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
            onMessage={(message) => {
              dispatch(
                createMessage({
                  connectionId: connection.id,
                  conversationName: conversation.name,
                  message
                })
              )
            }}
            onPersonClick={(name) => {
              dispatch({
                type: 'SELECT_CONVERSATION',
                connectionId: connection.id,
                conversationId: name
              })
            }}
            onRequestLeave={() => {
              dispatch({
                type: 'COMMAND_PART',
                connectionId: connection.id,
                channel: conversation.name
              })
            }}
            disconnected={!connection.isConnected}
          />
        ) : null}
      </div>
    )
  }
}

export default connector(Connection)
