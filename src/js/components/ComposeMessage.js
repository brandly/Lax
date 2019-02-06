// @flow
/* global SyntheticEvent, HTMLInputElement */
import React from 'react'

type Props = {
  nickname: string,
  onMessage: string => void
}

type State = {
  message: string
}

class ComposeMessage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      message: ''
    }
  }

  handleFormSubmission(event: SyntheticEvent<*>) {
    event.preventDefault()
    this.props.onMessage(this.state.message)
    this.setMessage('')
  }

  setMessage(message: string) {
    this.setState({ message })
  }

  handleChange(event: SyntheticEvent<*>) {
    if (event.target instanceof HTMLInputElement) {
      this.setMessage(event.target.value)
    }
  }

  render() {
    const { nickname } = this.props

    return (
      <form className="message compose-message" onSubmit={this.handleFormSubmission.bind(this)}>
        <h3 className="nickname from">{nickname}</h3>
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
