import React from 'react';
import { addons } from 'react/addons';
import { List } from 'immutable';

import ChannelStore from '../stores/channel-store';

import ChannelHeader from './channel-header';
import MessageList from './message-list';
import ComposeMessage from './compose-message';

function getChannel(channel) {
  return {
    messages: channel ? channel.getMessages() : List(),
    people: channel ? channel.getPeople() : List()
  }
}

const component = React.createClass({
  mixins: [addons.PureRenderMixin],

  componentWillMount() {
    ChannelStore.addChangeListener(this._onChange);
  },

  getInitialState() {
    return getChannel(this.props.channel);
  },

  _onChange() {
    this.setState(getChannel(this.props.channel));
  },

  render() {
    const channel = this.props.channel;
    const messages = this.state.messages;
    const people = this.state.people;

    return (
      <div className="right-panel channel">
        <div className="above-bottom-panel">
          <ChannelHeader channel={channel} people={people} />
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
