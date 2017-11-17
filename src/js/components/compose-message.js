import React from 'react'
import ConnectionStore from '../stores/connection-store'
import ChannelActions from '../actions/channel-actions'

class ComposeMessage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      message: '',
      nickname: ConnectionStore.getNickname()
    }
  }

  componentWillMount () {
    ConnectionStore.addChangeListener(this._onChange.bind(this))
  }

  _onChange () {
    this.setState({
      nickname: ConnectionStore.getNickname()
    })
  }

  handleFormSubmission (event) {
    event.preventDefault()

    ChannelActions.sendMessage({
      channel: this.props.channel.name,
      message: this.state.message
    })

    this.setMessage('')
  }

  setMessage (message) {
    this.setState({ message })
  }

  handleChange (event) {
    this.setMessage(event.target.value)
  }

  render () {
    if (!this.props.channel) return null

    return (
      <form className="message compose-message" onSubmit={this.handleFormSubmission.bind(this)}>
        <h3 className="nickname from">{this.state.nickname}</h3>
        <input type="text"
          placeholder="write message"
          className="body"
          required
          value={this.state.message}
          onChange={this.handleChange.bind(this)} />
      </form>
    )
  }
}

export default ComposeMessage
