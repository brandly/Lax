import React from 'react'
import ChannelHeader from './channel-header'
import MessageList from './MessageList'
import ComposeMessage from './compose-message'
import PeopleList from './people-list'

class Channel extends React.Component {
  constructor (props) {
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
    const { conversation } = this.props
    const { messages, people } = conversation
    const { showPeopleList } = this.state

    const peopleListEl = showPeopleList ? <PeopleList people={people} /> : null

    return (
      <div className="right-panel channel">
        <div className="above-bottom-panel">
          <ChannelHeader
            onPeopleClick={this.togglePeopleList.bind(this)}
            channel={conversation}
            people={people}
          />
          <div className="below-header">
            <MessageList messages={messages} />
          </div>
          {peopleListEl}
        </div>
        <div className="absolute-bottom-panel">
          <ComposeMessage channel={conversation} />
        </div>
      </div>
    )
  }
}

export default Channel
