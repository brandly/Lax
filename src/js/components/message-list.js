import React from 'react';
import { addons } from 'react/addons';
import URI from 'URIjs';

import classNames from 'classnames';
import ChannelStore from '../stores/channel-store';

const { Shell } = global.window.nwDispatcher.requireNwGui();

const component = React.createClass({
  mixins: [addons.PureRenderMixin],

  scrollToBottom() {
    const el = React.findDOMNode(this.refs.scroller);
    el.scrollTop = el.scrollHeight;
  },

  componentDidUpdate() {
    this.scrollToBottom();
  },

  handleLink(url, event) {
    event.preventDefault();
    Shell.openExternal(url);
  },

  linkify(text) {
    const split = text.split(URI.find_uri_expression);
    const result = [];

    for (var i = 0; i < split.length; ++i) {
      let value = split[i];
      if (value !== undefined) {
        if (i + 1 < split.length && split[i + 1] === undefined) {
          result.push(
            <a href={value}
               target="_blank"
               onClick={this.handleLink.bind(this, value)}>{value}</a>
            );
        } else {
          result.push(value);
        }
      }
    }
    return result;
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
          <h3 className="nickname from">{showFrom ? msg.from : ''}</h3>
          <p className="body">{action}<span className="text">{this.linkify(msg.message)}</span></p>
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
