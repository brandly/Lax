import React from 'react';
import { addons } from 'react/addons';
import ChannelActions from '../actions/channel-actions';

const component = React.createClass({
  mixins: [addons.PureRenderMixin],

  getInitialState() {
    return {
      channelName: null
    };
  },

  setChannelName(channelName) {
    this.setState({ channelName });
  },

  handleChange(event) {
    this.setChannelName(event.target.value);
  },

  handleFormSubmission(event) {
    event.preventDefault();
    ChannelActions.requestJoinChannel({
      channelName: this.state.channelName
    });
    this.setChannelName(null);
  },

  render() {
    return (
      <form className="form-panel" onSubmit={this.handleFormSubmission}>
        <input type="text"
               placeholder="join channel"
               required
               onChange={this.handleChange} />
        <input type="submit" value="+" />
      </form>
    );
  }
});

module.exports = component;
