import React from 'react';
import { addons } from 'react/addons';
import ChannelActions from '../actions/channel-actions';
import ChannelStore from '../stores/channel-store';

const component = React.createClass({
  mixins: [addons.PureRenderMixin],

  getInitialState() {
    return {};
  },

  handleFormSubmission(event) {
    event.preventDefault();
    ChannelActions.sendMessage({
      channel: ChannelStore.getSelectedChannel().name,
      message: this.state.message
    });
  },

  setMessage(event) {
    this.setState({
      message: event.target.value
    });
  },

  render() {
    return (
      <form className="form-panel" onSubmit={this.handleFormSubmission}>
        <input type="text"
               placeholder="write message"
               required
               onChange={this.setMessage} />
      </form>
    );
  }
});

module.exports = component;
