// @flow
import React from 'react'
import ConversationHeader from './ConversationHeader'
import MessageList from './MessageList'
import ComposeMessage from './ComposeMessage'
import PeopleList from './PeopleList'
import type { ConversationT } from '../flow'

type Props = {
  conversation: ConversationT,
  nickname: string
};

type State = {
  showPeopleList: boolean
};

class Conversation extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      showPeopleList: false
    }
  }

  togglePeopleList () {
    this.setState({
      showPeopleList: !this.state.showPeopleList
    })
  }

  render () {
    const { conversation, nickname } = this.props
    const { messages } = conversation
    const { showPeopleList } = this.state

    const peopleListEl = showPeopleList ? <PeopleList people={conversation.people} /> : null

    return (
      <div className="right-panel channel">
        <div className="above-bottom-panel">
          <ConversationHeader
            onPeopleClick={this.togglePeopleList.bind(this)}
            conversation={conversation}
          />
          <div className="below-header">
            <MessageList messages={messages} />
          </div>
          {peopleListEl}
        </div>
        <div className="absolute-bottom-panel">
          <ComposeMessage
            conversation={conversation}
            nickname={nickname}
            onMessage={msg => {
              console.log('TODO:', msg)
            }}
          />
        </div>
      </div>
    )
  }
}

export default Conversation
