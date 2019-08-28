// @flow
/* global SyntheticEvent, KeyboardEvent, HTMLInputElement */
import React from 'react'
import SelectList from '../modules/SelectList'

type Props = {
  nickname: string,
  onMessage: string => void
}

type SuggestionsType = ?SelectList<string>
type State = {
  message: string,
  suggestions: SuggestionsType,
  isFocused: boolean
}

// maybe reference common list in actions/conversations.js
const possibleSuggestions = new SelectList([], '/msg', [
  '/me',
  '/join',
  '/part',
  '/partall',
  '/notice',
  '/nick'
])
const suggestionsFor = (msg: string): SuggestionsType => {
  if (msg.length) {
    return possibleSuggestions.filter(suggestion => suggestion.startsWith(msg))
  }
  return null
}

class ComposeMessage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      message: '',
      suggestions: suggestionsFor(''),
      isFocused: false
    }
  }

  handleFormSubmission(event: SyntheticEvent<*>) {
    event.preventDefault()
    this.props.onMessage(this.state.message)
    this.setMessage('')
  }

  setMessage(message: string) {
    const suggestions = suggestionsFor(message)
    this.setState({ message, suggestions })
  }

  handleChange(event: SyntheticEvent<*>) {
    if (event.target instanceof HTMLInputElement) {
      this.setMessage(event.target.value)
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (this.state.suggestions) {
      switch (event.key) {
        case 'ArrowUp': {
          this.setState({
            suggestions: this.state.suggestions.prevWrap()
          })
          event.preventDefault()
          break
        }
        case 'ArrowDown': {
          this.setState({
            suggestions: this.state.suggestions.nextWrap()
          })
          event.preventDefault()
          break
        }
        case 'ArrowRight': {
          const message = this.state.suggestions.selected + ' '
          this.setState({
            message,
            suggestions: suggestionsFor(message)
          })
          break
        }
      }
    }
  }

  render() {
    const { nickname } = this.props
    const { suggestions, isFocused } = this.state

    return (
      <form
        className="message compose-message"
        onSubmit={this.handleFormSubmission.bind(this)}
      >
        <h3 className="nickname from">{nickname}</h3>
        <div style={{ height: '100%' }}>
          {isFocused && suggestions ? <Suggestions list={suggestions} /> : null}
          <input
            type="text"
            placeholder="write message"
            className="body"
            required
            value={this.state.message}
            onChange={this.handleChange.bind(this)}
            onKeyDown={this.handleKeyDown.bind(this)}
            onFocus={() => {
              this.setState({
                isFocused: true
              })
            }}
            onBlur={() => {
              this.setState({
                isFocused: false
              })
            }}
          />
        </div>
      </form>
    )
  }
}

const Suggestions = props => (
  <ul style={{ position: 'absolute', bottom: '100%' }}>
    {props.list
      .map((s, isSelected) => (
        <li
          key={s}
          className="selected"
          style={{ fontWeight: isSelected ? 'bold' : 'inherit' }}
        >
          {s}
        </li>
      ))
      .toArray()}
  </ul>
)

export default ComposeMessage
