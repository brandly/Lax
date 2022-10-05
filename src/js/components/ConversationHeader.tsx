import * as React from 'react'
import ChannelName from './ChannelName'
import type { ConversationT, PersonT } from '../flow'
type Props = {
  conversation: ConversationT
  onPeopleClick: (arg0: Array<PersonT>) => void
  dropdown: React.ReactNode
}

class ConversationHeader extends React.Component<
  Props,
  {
    dropped: boolean
  }
> {
  constructor(props: Props) {
    super(props)
    this.state = {
      dropped: false
    }
  }

  render() {
    const { conversation, dropdown } = this.props
    const { people } = conversation
    const isChannel = conversation.name[0] === '#'
    const { dropped } = this.state
    return (
      <div className="header channel-header">
        <h2 className="channel-heading">
          <ChannelName name={conversation.name} />
          {isChannel ? (
            <p
              className="channel-people-count"
              onClick={
                isChannel
                  ? () => {
                      this.props.onPeopleClick(people)
                    }
                  : null
              }
            >
              {people.length} {people.length === 1 ? 'person' : 'people'}
            </p>
          ) : null}
        </h2>
        {dropped ? dropdown : null}
        <button
          className="icon-btn"
          onClick={(e) => {
            e.stopPropagation()
            this.setState({
              dropped: !dropped
            })
          }}
        >
          <VerticalMenuIcon fill="#afb1b5" />
        </button>
      </div>
    )
  }
} // dots vertical menu by Gonzalo Bravo from the Noun Project
// https://thenounproject.com/term/vertical-menu/1609264/

const VerticalMenuIcon = (props) => (
  <svg viewBox="0 0 100 100" {...props}>
    <g color="#000" fontWeight={400} fontFamily="sans-serif">
      <path
        style={{
          lineHeight: 'normal',
          textIndent: 0,
          textAlign: 'start',
          textDecorationLine: 'none',
          textDecorationStyle: 'solid',
          textDecorationColor: '#000',
          textTransform: 'none',
          blockProgression: 'tb',
          whiteSpace: 'normal',
          isolation: 'auto',
          mixBlendMode: 'normal',
          solidColor: '#000',
          solidOpacity: 1
        }}
        d="M59 50c0-4.953-4.047-9-9-9s-9 4.047-9 9 4.047 9 9 9 9-4.047 9-9zm-3 0c0 3.331-2.669 6-6 6s-6-2.669-6-6 2.669-6 6-6 6 2.669 6 6zM59 26c0-4.953-4.047-9-9-9s-9 4.047-9 9 4.047 9 9 9 9-4.047 9-9zm-3 0c0 3.331-2.669 6-6 6s-6-2.669-6-6 2.669-6 6-6 6 2.669 6 6zM59 74c0-4.953-4.047-9-9-9s-9 4.047-9 9 4.047 9 9 9 9-4.047 9-9zm-3 0c0 3.331-2.669 6-6 6s-6-2.669-6-6 2.669-6 6-6 6 2.669 6 6z"
        overflow="visible"
      />
    </g>
  </svg>
)

export default ConversationHeader
