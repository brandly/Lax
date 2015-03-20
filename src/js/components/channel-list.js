import React from 'react';
import { addons } from 'react/addons';
import Immutable from 'immutable';
import classNames from 'classnames';
import key from 'keymaster';
import ChannelStore from '../stores/channel-store';
import ChannelActions from '../actions/channel-actions';

const component = React.createClass({
  mixins: [addons.PureRenderMixin],

  componentWillMount() {
    ChannelStore.addChangeListener(this._onChange);
    this.bindKeyboardShortcuts();
  },

  componentWillUnmount() {
    this.unbindKeyboardShortcuts();
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

  shortcuts: {
    nextChannel: '⌘+shift+]',
    prevChannel: '⌘+shift+['
  },

  // TODO: abstract this out into some "shortcuts" mixin
  // should just map "shortcuts" to methods, and it'll handle mount/unmount
  bindKeyboardShortcuts() {
    key(this.shortcuts.nextChannel, this.selectNextChannel);
    key(this.shortcuts.prevChannel, this.selectPrevChannel);
  },

  unbindKeyboardShortcuts() {
    key.unbind(this.shortcuts.nextChannel, this.selectNextChannel);
    key.unbind(this.shortcuts.prevChannel, this.selectPrevChannel);
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
