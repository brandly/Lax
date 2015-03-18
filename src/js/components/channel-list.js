import React from 'react';
import { addons } from 'react/addons';
import Immutable from 'immutable';
import classNames from 'classnames';
import ChannelStore from '../stores/channel-store';
import ChannelActions from '../actions/channel-actions';

const component = React.createClass({
  mixins: [addons.PureRenderMixin],

  componentWillMount() {
    ChannelStore.addChangeListener(this._onChange);
  },

  getInitialState() {
    return {
      channels: Immutable.List(),
      selectedChannel: {}
    };
  },

  _onChange() {
    this.setState({
      channels: ChannelStore.getChannels(),
      selectedChannel: ChannelStore.getSelectedChannel()
    });
  },

  selectChannel(channelName) {
    ChannelActions.selectChannel({ channelName });
  },

  render() {
    const channelElements = this.state.channels.sortBy(c => c.name).map((channel, i) => {
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
