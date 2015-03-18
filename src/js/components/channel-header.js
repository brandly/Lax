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

    if (channelName) {
      return (
        <div className="channel-header">
          <h2 className="channel-name">{channelName}</h2>
          <p className="channel-people-count">{peopleCount} people</p>
        </div>
      );
    } else {
      return null;
    }
  }
});

module.exports = component;
