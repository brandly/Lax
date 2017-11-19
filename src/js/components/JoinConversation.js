// @flow
/* global SyntheticEvent, HTMLInputElement */
import React from 'react'

type Props = {
  onJoin: string => void
};

type State = {
  channelName: string
};

class JoinConversation extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      channelName: ''
    }
  }

  setChannelName (channelName: string) {
    this.setState({ channelName })
  }

  handleChange (event: SyntheticEvent<*>) {
    if (event.target instanceof HTMLInputElement) {
      this.setChannelName(event.target.value)
    }
  }

  handleFormSubmission (event: SyntheticEvent<*>) {
    event.preventDefault()
    this.props.onJoin(this.state.channelName)
    this.setChannelName('')
  }

  render () {
    return (
      <form
        className="join-channel"
        onSubmit={this.handleFormSubmission.bind(this)}
      >
        <input
          type="text"
          placeholder="join channel"
          className="channel-list-item"
          required
          value={this.state.channelName}
          onChange={this.handleChange.bind(this)}
        />
        {this.state.channelName.length ? <input type="submit" value="+" /> : null}
      </form>
    )
  }
}

export default JoinConversation
