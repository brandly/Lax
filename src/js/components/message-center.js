import React from 'react';
import { addons } from 'react/addons';

import ConnectionHeader from './connection-header';
import ChannelList from './channel-list';
import JoinChannel from './join-channel';

import ChannelHeader from './channel-header';
import MessageList from './message-list';
import ComposeMessage from './compose-message';

import Channel from './channel';

const component = React.createClass({
  mixins: [addons.PureRenderMixin],

  getInitialState() {
    return {};
  },

  render() {
    return (
      <div className="message-center">
        <div className="left-panel">
          <ConnectionHeader />
          <div className="below-header scrolling-panel">
            <ChannelList />
            <JoinChannel />
          </div>
        </div>
        <Channel />
      </div>
    );
  }
});

module.exports = component;
