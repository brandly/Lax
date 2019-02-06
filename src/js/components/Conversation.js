// @flow
import React from 'react'
import classNames from 'classnames'
import ConversationHeader from './ConversationHeader'
import MessageList from './MessageList'
import ComposeMessage from './ComposeMessage'
import PeopleList from './PeopleList'
import type { ConversationT } from '../flow'

type Props = {
  conversation: ConversationT,
  onMessage: string => void,
  nickname: string,
  disconnected: boolean,
  onPersonClick: string => void
}

type State = {
  showPeopleList: boolean,
  filterStatusUpdates: boolean
}

class Conversation extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      showPeopleList: true,
      filterStatusUpdates: true
    }
  }

  togglePeopleList() {
    this.setState({
      showPeopleList: !this.state.showPeopleList
    })
  }

  render() {
    const { conversation, nickname, disconnected } = this.props
    const { messages } = conversation
    const { filterStatusUpdates } = this.state
    const showPeopleList =
      this.state.showPeopleList && conversation.people.length > 0

    const peopleListEl = showPeopleList ? (
      <PeopleList
        people={conversation.people}
        onCloseRequest={this.togglePeopleList.bind(this)}
        onPersonClick={this.props.onPersonClick}
      />
    ) : null

    return (
      <div
        className={classNames('right-panel channel', {
          'with-details': showPeopleList
        })}
      >
        <div className="above-bottom-panel">
          <ConversationHeader
            onPeopleClick={this.togglePeopleList.bind(this)}
            onFilterClick={() => {
              this.setState({
                filterStatusUpdates: !filterStatusUpdates
              })
            }}
            filterActive={filterStatusUpdates}
            conversation={conversation}
          />
          <div className="below-header">
            {disconnected && (
              <p className="disconnected-error">
                Your computer has disconnected from the server.
              </p>
              // but it's trying to reconnect.
            )}
            <MessageList
              messages={
                filterStatusUpdates
                  ? messages.filter(notStatusUpdate)
                  : messages
              }
            />
          </div>
        </div>
        <div className="absolute-bottom-panel">
          <ComposeMessage
            nickname={nickname}
            onMessage={this.props.onMessage}
          />
        </div>
        {peopleListEl}
      </div>
    )
  }
}

const statusUpdates = ['join', 'part', 'away', 'quit']
function notStatusUpdate(message) {
  return !statusUpdates.includes(message.type)
}

export default Conversation
