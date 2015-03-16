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

  scrollToBottom() {
    const el = React.findDOMNode(this.refs.scroller);
    el.scrollTop = el.scrollHeight;
  },

  componentDidUpdate() {
    this.scrollToBottom();
  },

  render() {
    const { channel, messages } = this.state;

    if (!channel) {
      return null;
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
      <div className="scrolling-panel" ref="scroller">
        <ul className="message-list">
          {messageElements.toArray()}
        </ul>
      </div>
    );
  }
});

module.exports = component;
