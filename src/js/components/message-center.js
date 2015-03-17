import React from 'react';
import { addons } from 'react/addons';

import ChannelHeader from './channel-header';
import ChannelList from './channel-list';
import JoinChannel from './join-channel';

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
          <div className="above-bottom-panel">
            <ChannelList />
          </div>
          <div className="absolute-bottom-panel">
            <JoinChannel />
          </div>
        </div>
        <Channel />
      </div>
    );
  }
});

module.exports = component;
