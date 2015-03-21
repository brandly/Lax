import React from 'react';
import { addons } from 'react/addons';
import Immutable from 'immutable';
import classNames from 'classnames';

import ChannelStore from '../stores/channel-store';
import ChannelActions from '../actions/channel-actions';
import KeymasterMixin from '../mixins/keymaster';

const component = React.createClass({
  mixins: [addons.PureRenderMixin, KeymasterMixin],

  componentWillMount() {
    ChannelStore.addChangeListener(this._onChange);
    this.setKeymaster({
      '⌘+shift+]': this.selectNextChannel,
      '⌘+shift+[': this.selectPrevChannel
    });
  },

  getInitialState() {
    return {
      channels: Immutable.List(),
      selectedChannel: {}
    };
  },

  _onChange() {
    const channels = ChannelStore.getChannels();

    this.setState({
      channels: channels.sortBy(this.channelOrder),
      selectedChannel: ChannelStore.getSelectedChannel()
    });
  },

  selectChannel(channelName) {
    ChannelActions.selectChannel({ channelName });
  },

  selectChannelAtIndex(i) {
    this.selectChannel(this.state.channels.get(i).name);
  },

  selectNextChannel() {
    const { channels, selectedChannel } = this.state;
    if (!channels) return;

    const currentIndex = channels.indexOf(selectedChannel);
    const nextIndex = (currentIndex + 1) % channels.size;

    this.selectChannelAtIndex(nextIndex);
  },

  selectPrevChannel() {
    const { channels, selectedChannel } = this.state;
    if (!channels) return;

    const currentIndex = channels.indexOf(selectedChannel);
    const prevIndex = (currentIndex === 0) ? (channels.size - 1) : (currentIndex - 1);

    this.selectChannelAtIndex(prevIndex);
  },

  channelOrder(channel) {
    return channel.name;
  },

  render() {
    const channelElements = this.state.channels.map((channel, i) => {
      const classes = classNames({
        'channel-list-item': true,
        'is-selected': channel.name === this.state.selectedChannel.name
      });

      return (
        <li className={classes}
            key={channel.name}
            onClick={this.selectChannel.bind(this, channel.name)}>{channel.name}</li>
      );
    });

    return (
      <ul className="channel-list">
        {channelElements.toArray()}
      </ul>
    );
  }
});

module.exports = component;
