// @flow
import React from 'react'
import ChannelName from './ChannelName'
import type { ConversationT, PersonT } from '../flow'

type Props = {
  conversation: ConversationT,
  filterActive: boolean,
  onPeopleClick: Array<PersonT> => void,
  onFilterClick: void => void
};

class ConversationHeader extends React.Component<Props> {
  render () {
    const { conversation, onFilterClick, filterActive } = this.props
    const { people } = conversation
    const isChannel = conversation.name[0] === '#'

    return (
      <div
        className="header channel-header"
        onClick={isChannel ? () => {
          this.props.onPeopleClick(people)
        } : null}
      >
        <h2 className="channel-heading">
          <ChannelName name={conversation.name} />
          {isChannel ? (
            <p className="channel-people-count">
              {people.length} {people.length === 1 ? 'person' : 'people'}
            </p>
          ) : null}
        </h2>
        <button
          className="icon-btn"
          onClick={e => {
            e.stopPropagation()
            onFilterClick()
          }}
        >
          <DoorIcon fill={filterActive ? '#afb1b5' : '#333'} />
        </button>
      </div>
    )
  }
}

// Created by ✦ Shmidt Sergey ✦
// from the Noun Project
const DoorIcon = props =>
  <svg fill={props.fill} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" enableBackground="new 0 0 32 32" x="0px" y="0px">
    <g>
      <path d="M18 28h-7.501c-1.378 0-2.499-1.121-2.499-2.498v-4.502c0-.553.448-1 1-1s1 .447 1 1v4.502c0 .274.224.498.499.498h7.501c.553 0 1 .447 1 1s-.447 1-1 1zM12 15h-11c-.552 0-1-.448-1-1s.448-1 1-1h11c.552 0 1 .448 1 1s-.448 1-1 1zM9 18c-.256 0-.512-.098-.707-.293-.391-.391-.391-1.023 0-1.414l3-3c.391-.391 1.023-.391 1.414 0s.391 1.023 0 1.414l-3 3c-.195.195-.451.293-.707.293zM12 15c-.256 0-.512-.098-.707-.293l-3-3c-.391-.391-.391-1.023 0-1.414s1.023-.391 1.414 0l3 3c.391.391.391 1.023 0 1.414-.195.195-.451.293-.707.293zM9 8c-.552 0-1-.448-1-1v-4.501c0-1.378 1.121-2.499 2.499-2.499h19.006c1.376 0 2.495 1.119 2.495 2.495 0 .552-.447 1-1 1s-1-.448-1-1c0-.273-.222-.495-.495-.495h-19.006c-.275 0-.499.224-.499.499v4.501c0 .552-.448 1-1 1zM19.498 32c-.547 0-1.081-.18-1.527-.525-.617-.478-.971-1.2-.971-1.98v-22.94c0-1.112.715-2.075 1.78-2.397l10.655-3.214c.53-.159 1.087.14 1.246.669.036.12.049.241.041.359.089-.026.181-.039.278-.039.553 0 1 .448 1 1v23.979c0 1.142-.772 2.138-1.877 2.424l-9.992 2.583c-.21.055-.422.081-.633.081zm10.505-29.138l-10.645 3.21c-.213.065-.358.259-.358.483v22.94c0 .215.122.342.195.398.072.057.226.144.436.09l9.991-2.583c.223-.057.378-.258.378-.488v-23.979l.003-.071z"/>
    </g>
    <text x="0" y="47" fill="#000000" fontSize="5px" fontWeight="bold" fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">Created by ✦ Shmidt Sergey ✦</text>
    <text x="0" y="52" fill="#000000" fontSize="5px" fontWeight="bold" fontFamily="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">from the Noun Project</text>
  </svg>

export default ConversationHeader
