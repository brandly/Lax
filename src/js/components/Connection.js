// @flow
/* global $Shape */
import React from 'react'
import { connect } from 'react-redux'
import browserHistory from '../modules/browser-history'
import ConnectionHeader from './ConnectionHeader'
import ConversationList from './ConversationList'
import JoinConversation from './JoinConversation'
import Conversation from './Conversation'
import {
  getConnectionById,
  getConversationByName
} from '../reducers/selectors'
import {
  commandJoin
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
  conversation: ConversationT
}

class Connection extends React.Component<Props> {
  componentWillMount () {
    if (!this.props.connection) {
      browserHistory.replace('/')
    }
  }

  viewConversation (name) {
    const dest = [
      'connection',
      this.props.connection.id,
      'conversation',
      encodeURIComponent(name)
    ].map(v => '/' + v).join('')

    browserHistory.push(dest)
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
              selectedConversationId={conversation.name}
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
        <Conversation
          nickname={connection.nickname}
          conversation={conversation}
        />
      </div>
    )
  }
}

export default connect((state: IrcState, ownProps) : $Shape<Props> => {
  const { connectionId, conversationId } = ownProps.params

  const connection = getConnectionById(state, connectionId)
  const conversation = getConversationByName(state, conversationId || connectionId)

  return {
    connection,
    conversation
  }
})(Connection)
