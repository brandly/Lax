import React from 'react';
import { addons } from 'react/addons';
import MessageCenter from './message-center';
import ConnectionCreator from './connection-creator';
import ConnectionStore from '../stores/connection-store';

const app = React.createClass({
  mixins: [addons.PureRenderMixin],

  componentWillMount() {
    ConnectionStore.addChangeListener(this._onChange);
  },

  getInitialState() {
    return {
      hasConnection: false
    };
  },

  _onChange() {
    this.setState({
      hasConnection: !!ConnectionStore.getConnection()
    });
  },

  render() {
    return (
      <div className="irc">
        {this.state.hasConnection ?
          <MessageCenter /> :
          <ConnectionCreator />
        }
      </div>
    );
  }
});

module.exports = app;
