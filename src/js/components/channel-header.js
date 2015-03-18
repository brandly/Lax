import React from 'react';
import { addons } from 'react/addons';

const component = React.createClass({
  mixins: [addons.PureRenderMixin],

  render() {
    const channel = this.props.channel;
    const peopleCount = this.props.people.size;

    if (!channel) {
      return null;
    }

    const channelName = channel.name;

    var nameEl, countEl;
    if (channelName) {
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
