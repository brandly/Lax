import React from 'react';
import { addons } from 'react/addons';

import classNames from 'classnames';
import ChannelStore from '../stores/channel-store';

const component = React.createClass({
  mixins: [addons.PureRenderMixin],

  scrollToBottom() {
    const el = React.findDOMNode(this.refs.scroller);
    el.scrollTop = el.scrollHeight;
  },

  componentDidUpdate() {
    this.scrollToBottom();
  },

  render() {
    const { messages } = this.props;

    if (!messages) {
      return null;
    }

    const messageElements = messages.map((msg, i) => {
      const action = (msg.type !== 'priv') ? <span className="command">{msg.type}</span> : null;
      const showFrom = (i === 0 || messages.get(i - 1).from !== msg.from);

      const classes = classNames({
        message: true,
        [msg.type]: true
      });

      return (
        <li className={classes} key={i}>
          <h3 className="from">{showFrom ? msg.from : ''}</h3>
          <p className="body">{action}<span className="text">{msg.message}</span></p>
          <p className="when">{formatDate(msg.when)}</p>
        </li>
      );
    });

    return (
      <div className="scrolling-panel" ref="scroller">
        <ul className="message-list">
          {messageElements.toArray()}
        </ul>
      </div>
    );
  }
});

function formatDate(d) {
  return `${twoDigits(d.getHours())}:${twoDigits(d.getMinutes())}:${twoDigits(d.getSeconds())}`;
}

function twoDigits(str) {
  str = '' + str;
  return (str.length < 2) ? ('0' + str) : str;
}

module.exports = component;
