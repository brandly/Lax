/* global SyntheticEvent, KeyboardEvent, HTMLInputElement */
import React from "react";
import SelectList from "../modules/SelectList";
import type { PersonT } from "../flow";
type Props = {
  nickname: string;
  onMessage: (arg0: string) => void;
  people: Array<PersonT>;
};
type SuggestionsType = SelectList<string> | null | undefined;
type State = {
  message: string;
  suggestions: SuggestionsType;
  isFocused: boolean;
};
// maybe reference common list in actions/conversations.js
const possibleSuggestions = new SelectList([], '/msg', ['/me', '/join', '/part', '/partall', '/notice', '/nick']);

const suggestionsFor = (msg: string, people: Array<PersonT>): SuggestionsType => {
  if (msg.length) {
    const cmd = possibleSuggestions.filter(suggestion => suggestion.startsWith(msg));

    if (cmd) {
      return cmd;
    }

    const prefix = '/msg ';

    if (people.length && msg.startsWith(prefix)) {
      const start = msg.slice(prefix.length).toLowerCase();
      const potentials = SelectList.fromElement(people[0]).concat(people.slice(1)).filter(person => person.name.toLowerCase().startsWith(start));

      if (potentials) {
        return potentials.map(person => prefix + person.name);
      }
    }
  }

  return null;
};

class ComposeMessage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      message: '',
      suggestions: suggestionsFor('', props.people),
      isFocused: false
    };
  }

  handleFormSubmission(event: React.SyntheticEvent<any>) {
    event.preventDefault();
    this.props.onMessage(this.state.message);
    this.setMessage('');
  }

  setMessage(message: string) {
    const suggestions = suggestionsFor(message, this.props.people);
    this.setState({
      message,
      suggestions
    });
  }

  handleChange(event: React.SyntheticEvent<any>) {
    if (event.target instanceof HTMLInputElement) {
      this.setMessage(event.target.value);
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (this.state.suggestions) {
      switch (event.key) {
        case 'ArrowUp':
          {
            this.setState({
              suggestions: this.state.suggestions.prevWrap()
            });
            event.preventDefault();
            break;
          }

        case 'ArrowDown':
          {
            this.setState({
              suggestions: this.state.suggestions.nextWrap()
            });
            event.preventDefault();
            break;
          }

        case 'ArrowRight':
        case 'Tab':
          {
            const message = this.state.suggestions.selected + ' ';
            this.setState({
              message,
              suggestions: suggestionsFor(message, this.props.people)
            });
            event.preventDefault();
            break;
          }
      }
    }
  }

  render() {
    const {
      nickname
    } = this.props;
    const {
      suggestions,
      isFocused
    } = this.state;
    return <div className="message-list">
        <form className="message compose-message" onSubmit={this.handleFormSubmission.bind(this)}>
          <h3 className="nickname from">{nickname}</h3>
          {isFocused && suggestions ? <Suggestions list={suggestions} onRequestSelect={requested => {
          this.setState({
            suggestions: suggestions.selectWhere(s => s === requested)
          });
        }} /> : null}
          <input type="text" placeholder="write message" className="body" required value={this.state.message} onChange={this.handleChange.bind(this)} onKeyDown={this.handleKeyDown.bind(this)} onFocus={() => {
          this.setState({
            isFocused: true
          });
        }} onBlur={() => {
          this.setState({
            isFocused: false
          });
        }} />
        </form>
      </div>;
  }

}

const maxSuggestions = 8;

const Suggestions = props => <ul className="pane suggestions-list">
    {props.list.map((s, isSelected) => <li key={s} className={isSelected ? 'selected' : null} onMouseEnter={() => {
    props.onRequestSelect(s);
  }}>
          {s}
        </li>).toArray().slice(0, maxSuggestions)}
  </ul>;

export default ComposeMessage;