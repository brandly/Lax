import React from 'react'

class JoinChannel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      channelName: ''
    }
  }

  setChannelName (channelName) {
    this.setState({ channelName })
  }

  handleChange (event) {
    this.setChannelName(event.target.value)
  }

  handleFormSubmission (event) {
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

export default JoinChannel
