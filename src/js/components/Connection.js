// @flow
/* global $Shape */
import React from 'react'
import { connect } from 'react-redux'
import ConnectionHeader from './ConnectionHeader'
import ConversationList from './ConversationList'
import JoinConversation from './JoinConversation'
import Conversation from './Conversation'
import {
  getConnectionById,
  getConversationByName
} from '../reducers/selectors'
import {
  commandJoin,
  createMessage
} from '../actions'
import type {
  Dispatch,
  IrcState,
  ConnectionT,
  ConversationT
} from '../flow'

type Props = {
  dispatch: Dispatch,
  connection: ConnectionT,
  conversation: ?ConversationT
};

class Connection extends React.Component<Props> {
  viewConversation (conversationId) {
    this.props.dispatch({
      type: 'REDIRECT',
      route: {
        view: 'CONNECTION',
        connectionId: this.props.connection.id,
        conversationId
      }
    })
  }

  render () {
    const {
      connection,
      conversation,
      dispatch
    } = this.props

    return (
      <div className="message-center">
        <div className="left-panel">
          <ConnectionHeader
            connection={connection}
          />
          <div className="below-header scrolling-panel">
            <ConversationList
              connectionId={connection.id}
              onSelectConversation={name => {
                this.viewConversation(name)
              }}
              selectedConversationId={conversation && conversation.name}
            />
            {connection.isWelcome ? (
              <JoinConversation
                onJoin={name => {
                  dispatch(commandJoin(connection.id, name))
                  this.viewConversation(name)
                }}
              />
            ) : null}
          </div>
        </div>
        {conversation ? (
          <Conversation
            nickname={connection.nickname}
            conversation={conversation}
            onMessage={message => {
              dispatch(createMessage({
                connectionId: connection.id,
                conversationName: conversation.name,
                message
              }))
            }}
          />
        ) : null}
      </div>
    )
  }
}

export default connect((state: IrcState, ownProps): $Shape<Props> => {
  if (state.route.view !== 'CONNECTION') throw new Error()
  const { connectionId, conversationId } = state.route

  const connection = getConnectionById(state, connectionId)
  const conversation = getConversationByName(state, conversationId || connectionId)

  return {
    connection,
    conversation
  }
})(Connection)
