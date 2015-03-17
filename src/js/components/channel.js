import React from 'react';
import { addons } from 'react/addons';

import ChannelStore from '../stores/channel-store';

import ChannelHeader from './channel-header';
import MessageList from './message-list';
import ComposeMessage from './compose-message';

function getChannel() {
  return {
    channel: ChannelStore.getSelectedChannel()
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
    return (
      <div className="right-panel channel">
        <div className="above-bottom-panel">
          <ChannelHeader />
          <div className="below-channel-header">
            <MessageList />
          </div>
        </div>
        <div className="absolute-bottom-panel">
          <ComposeMessage />
        </div>
      </div>
    );
  }
});

module.exports = component;
