import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import MessageCenter from './message-center';
import ConnectionCreator from './connection-creator';
import ConnectionStore from '../stores/connection-store';

import MainMenu from '../nw/main-menu';

const app = React.createClass({
  mixins: [PureRenderMixin],

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
