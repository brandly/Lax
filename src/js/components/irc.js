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
      isWelcome: false
    };
  },

  _onChange() {
    this.setState({
      isWelcome: ConnectionStore.isWelcome
    });
  },

  render() {
    return (
      <div className="irc">
        {this.state.isWelcome ?
          <MessageCenter /> :
          <ConnectionCreator />
        }
      </div>
    );
  }
});

module.exports = app;
