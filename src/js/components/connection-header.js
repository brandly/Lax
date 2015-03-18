import React from 'react';
import { addons } from 'react/addons';
import ConnectionStore from '../stores/connection-store';

function getServer() {
  return {
    server: ConnectionStore.server
  };
}

const component = React.createClass({
  mixins: [addons.PureRenderMixin],

  componentWillMount() {
    ConnectionStore.addChangeListener(this._onChange);
  },

  getInitialState() {
    return getServer();
  },

  _onChange() {
    this.setState(getServer());
  },

  render() {
    return (
      <div className="header connection-header">
        <h2 className="vertical-center server">{this.state.server}</h2>
      </div>
    );
  }
});

module.exports = component;
