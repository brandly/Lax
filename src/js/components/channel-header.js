import React from 'react';
import { addons } from 'react/addons';
import { List } from 'immutable';
import ChannelStore from '../stores/channel-store';

const component = React.createClass({
  mixins: [addons.PureRenderMixin],

  componentWillMount() {
    ChannelStore.addChangeListener(this._onChange);
  },

  getInitialState() {
    return {
      channelName: '',
      channelPeople: List()
    };
  },

  _onChange() {
    const channel = ChannelStore.getSelectedChannel();
    this.setState({
      channelName: channel.name,
      channelPeople: channel.getPeople()
    });
  },

  render() {
    const peopleCount = this.state.channelPeople.size;


    if (this.state.channelName) {
      return (
        <div className="channel-header">
          <h2 className="channel-name">{this.state.channelName}</h2>
          <p className="channel-people-count">{peopleCount} people</p>
        </div>
      );
    } else {
      return null;
    }
  }
});

module.exports = component;
