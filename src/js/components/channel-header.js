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

    var nameEl, countEl;
    if (this.state.channelName) {
      nameEl = <h2 className="channel-name vertical-center">{this.state.channelName}</h2>;
      countEl = <p className="channel-people-count vertical-center">{peopleCount} people</p>
    } else {
      nameEl = null;
      countEl = null;
    }

    return (
      <div className="header channel-header">
        {nameEl}{countEl}
      </div>
    );
  }
});

module.exports = component;
