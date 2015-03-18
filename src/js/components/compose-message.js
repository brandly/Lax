import React from 'react';
import { addons } from 'react/addons';
import ChannelActions from '../actions/channel-actions';

const component = React.createClass({
  mixins: [addons.PureRenderMixin],

  getInitialState() {
    return {
      message: ''
    };
  },

  handleFormSubmission(event) {
    event.preventDefault();

    if (!this.props.channel) {
      return null;
    }

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
    return (
      <form className="form-panel" onSubmit={this.handleFormSubmission}>
        <input type="text"
               placeholder="write message"
               required
               value={this.state.message}
               onChange={this.handleChange} />
      </form>
    );
  }
});

module.exports = component;
