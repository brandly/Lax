import React from 'react';
import { addons } from 'react/addons';
import ChannelStore from '../stores/channel-store';

const component = React.createClass({
  mixins: [addons.PureRenderMixin],

  componentWillMount() {
    ChannelStore.addChangeListener(this._onChange);
  },

  getInitialState() {
    return {
      channel: null,
      messages: null
    };
  },

  _onChange() {
    const channel = ChannelStore.getSelectedChannel();
    this.setState({
      channel: channel,
      messages: channel.getMessages()
    });
  },

  render() {
    const { channel, messages } = this.state;

    if (!channel) {
      return <h4>no channel selected</h4>;
    }

    const messageElements = messages.map((msg, i) => {
      return (
        <li className="message" key={i}>
          <h3 className="from">{msg.from}</h3>
          <p className="body">{msg.message}</p>
          <span className="when">{msg.when}</span>
        </li>
      );
    });

    return (
      <ul className="scrolling-panel message-list">
        {messageElements.toArray()}
      </ul>
    );
  }
});

module.exports = component;
