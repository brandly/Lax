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
  onMessage: (string) => void,
  nickname: string,
  disconnected: boolean,
  onPersonClick: (string) => void,
  onRequestLeave: () => void
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
            dropdown={
              <ul className="pane conversation-dropdown">
                <li>
                  <label>
                    <input
                      type="checkbox"
                      checked={!filterStatusUpdates}
                      onChange={() => {
                        this.setState({
                          filterStatusUpdates: !filterStatusUpdates
                        })
                      }}
                    />
                    Status Updates
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="checkbox"
                      checked={showPeopleList}
                      onChange={this.togglePeopleList.bind(this)}
                    />
                    People List
                  </label>
                </li>
                {conversation.type !== 'CONNECTION' && (
                  <>
                    <hr />
                    <li>
                      <button
                        style={{ width: '100%' }}
                        onClick={() => {
                          this.props.onRequestLeave()
                        }}
                      >
                        Leave Channel
                      </button>
                    </li>
                  </>
                )}
              </ul>
            }
            conversation={conversation}
          />
          <div className="below-header">
            {disconnected && (
              <p className="disconnected-error">
                <AlertIcon
                  width={18}
                  height={18}
                  stroke="#c51e21"
                  fill="#c51e21"
                />
                <span>Connection lost.</span>
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
            people={conversation.people}
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

// Alert by Wolf Lupus from the Noun Project
// https://thenounproject.com/term/alert/14055/
const AlertIcon = (props) => (
  <svg viewBox="0 0 100 100" {...props}>
    <path d="M-192 0H-7v99h-185zM0-36h100v30H0z" />
    <path stroke="#FFF" strokeMiterlimit={10} d="M8-14.5h10M-179 16.5h17" />
    <path d="M-170.802 31.318h8.721v8.642h-8.721z" />
    <path d="M-164.455 42.312h4.747v-4.703h-4.747v4.703zm5.189.437h-5.63V37.17h5.63v5.579zm-6.955 1.313h8.279v-8.203h-8.279v8.203zm8.721.438h-9.163v-9.079h9.163V44.5z" />
    <path d="M-166.149 44.133l-.143-.142 8.279-8.204.142.142z" />
    <path fill="none" d="M-179 58h35v32.5h-35z" />

    <path d="M-126.514 34.815h10.261V45h-10.261zM-126.477 31.766h.522v2.337h-.522zM-116.813 31.766h.523v2.337h-.523z" />
    <path d="M-127 32.337h11.233v.572H-127zM-83.805 33.844H-73.5V44h-10.305zM-76.809 28.707h3.308v3.261h-3.308z" />
    <path
      stroke="#FFF"
      strokeMiterlimit={10}
      d="M-178.5 22.5h30v30h-30zM-136.5 22.5h30v30h-30zM-93.5 22.5h30v30h-30zM-49.5 22.5h30v30h-30z"
    />
    <g>
      <path d="M87.999 92.65H12.097c-4.451 0-8.034-1.783-9.83-4.896-1.795-3.108-1.549-7.104.677-10.957l37.95-65.733C43.122 7.21 46.458 5 50.049 5c3.592 0 6.928 2.211 9.153 6.065L97.15 76.799c2.227 3.854 2.474 7.848.679 10.957-1.796 3.111-5.379 4.894-9.83 4.894zm-37.95-79.672c-.521 0-1.417.642-2.245 2.077L9.853 80.787c-.829 1.434-.937 2.531-.677 2.982.26.448 1.264.903 2.921.903h75.902c1.657 0 2.66-.455 2.921-.905.26-.449.15-1.545-.678-2.98l-37.95-65.733c-.827-1.434-1.724-2.076-2.243-2.076z" />
      <path d="M45.313 57.395c.21 2.179.563 3.781 1.081 4.9.65 1.408 1.856 2.152 3.49 2.152 1.599 0 2.813-.754 3.513-2.18.569-1.164.928-2.744 1.092-4.818l1.406-16.12c.155-1.509.234-3.025.234-4.504 0-2.643-.347-4.642-1.064-6.113-.576-1.181-1.875-2.587-4.787-2.587-1.872 0-3.413.633-4.58 1.881-1.149 1.229-1.732 2.916-1.732 5.02 0 1.356.1 3.593.297 6.655l1.05 15.714zM50.016 67.895c-1.683 0-3.126.595-4.292 1.758-1.167 1.166-1.758 2.601-1.758 4.259 0 1.889.633 3.396 1.882 4.479 1.201 1.045 2.625 1.571 4.233 1.571 1.59 0 3.001-.535 4.194-1.596 1.229-1.095 1.854-2.591 1.854-4.455 0-1.664-.604-3.101-1.8-4.269-1.186-1.158-2.638-1.747-4.313-1.747z" />
    </g>
  </svg>
)
