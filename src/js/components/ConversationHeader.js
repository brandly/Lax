// @flow
import React from 'react'
import ChannelName from './ChannelName'
import type { ConversationT, PersonT } from '../flow'

type Props = {
  conversation: ConversationT,
  onPeopleClick: Array<PersonT> => void
};

class ConversationHeader extends React.Component<Props> {
  render () {
    const { conversation } = this.props
    const { people } = conversation
    const isChannel = conversation.name[0] === '#'

    return (
      <div
        className="header channel-header"
        onClick={isChannel ? () => {
          this.props.onPeopleClick(people)
        }: null}
      >
        <h2 className="channel-heading">
          <ChannelName name={conversation.name} />
          {isChannel ? (
            <p className="channel-people-count">
              {people.length} {people.length === 1 ? 'person' : 'people'}
            </p>
          ) : null}
        </h2>
      </div>
    )
  }
}

export default ConversationHeader
