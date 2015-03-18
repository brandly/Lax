import React from 'react';
import { addons } from 'react/addons';
import ChannelActions from '../actions/channel-actions';

const component = React.createClass({
  mixins: [addons.PureRenderMixin],

  getInitialState() {
    return {
      channel: null
    };
  },

  handleFormSubmission(event) {
    event.preventDefault();

    ChannelActions.sendMessage({
      channel: this.props.channel.name,
      message: this.state.message
    });

    this.setMessage('');
  },

  setMessage(message) {
    this.setState({ message });
  },

  handleChange(event) {
    this.setMessage(event.target.value);
  },

  render() {
    if (!this.props.channel) return null;

    return (
      <form className="message compose-message" onSubmit={this.handleFormSubmission}>
        <h3 className="from">brandly</h3>
        <input type="text"
               placeholder="write message"
               className="body"
               required
               value={this.state.message}
               onChange={this.handleChange} />
      </form>
    );
  }
});

module.exports = component;
