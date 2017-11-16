import React from 'react'
import { connect } from 'react-redux'
import browserHistory from '../modules/browser-history'
import ConnectionHeader from './ConnectionHeader'
import ChannelList from './channel-list'
import JoinChannel from './join-channel'
import Channel from './channel'

class Connection extends React.Component {
  componentWillMount () {
    if (!this.props.connection) {
      // TODO: replace
      browserHistory.push('/')
    }
  }

  render () {
    const {
      connection,
      conversation
    } = this.props

    return (
      <div className="message-center">
        <div className="left-panel">
          <ConnectionHeader
            connection={connection}
          />
          <div className="below-header scrolling-panel">
            <ChannelList />
            <JoinChannel />
          </div>
        </div>
        <Channel conversation={conversation} />
      </div>
    )
  }
}

export default connect((state, ownProps) => {
  const { connectionId, conversationId } = ownProps.params

  const connection = getConnectionById(state, connectionId)
  const conversation = getConversationByName(state, conversationId || connectionId)

  return {
    connection,
    conversation
  }
})(Connection)

function getConnectionById (state, connectionId) {
  return state.connections.list.find(({ id }) => id === connectionId)
}

function getConversationByName (state, conversationId) {
  return state.conversations.list.find(({ name }) => name === conversationId)
}
