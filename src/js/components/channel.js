import React from 'react';
import { addons } from 'react/addons';
import { List } from 'immutable';

import ChannelStore from '../stores/channel-store';

import ChannelHeader from './channel-header';
import MessageList from './message-list';
import ComposeMessage from './compose-message';

function getChannel() {
  const channel = ChannelStore.getSelectedChannel();
  return {
    channel: channel,
    messages: channel ? channel.getMessages() : List()
  }
}

const component = React.createClass({
  mixins: [addons.PureRenderMixin],

  componentWillMount() {
    ChannelStore.addChangeListener(this._onChange);
  },

  getInitialState() {
    return getChannel();
  },

  _onChange() {
    this.setState(getChannel());
  },

  render() {
    const channel = this.state.channel;
    const messages = this.state.messages;

    return (
      <div className="right-panel channel">
        <div className="above-bottom-panel">
          <ChannelHeader channel={channel} />
          <div className="below-channel-header">
            <MessageList messages={messages} />
          </div>
        </div>
        <div className="absolute-bottom-panel">
          <ComposeMessage channel={channel} />
        </div>
      </div>
    );
  }
});

module.exports = component;
