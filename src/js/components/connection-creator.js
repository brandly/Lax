import React from 'react';
import { addons } from 'react/addons';
import ConnectionActions from '../actions/connection-actions';

const component = React.createClass({
  mixins: [addons.PureRenderMixin],

  storedKeys: ['realName', 'nickname', 'server', 'port'],

  getInitialState() {
    const state = {isConnecting: false};
    this.storedKeys.forEach(key => {
      state[key] = window.localStorage[key] || ''
    });
    return state;
  },

  handleChange(key, event) {
    const { value } = event.target;

    if (contains(this.storedKeys, key)) {
      window.localStorage[key] = value;
    }

    this.setState({
      [key]: value
    });
  },

  handleFormSubmission(event) {
    event.preventDefault();
    this.setState({isConnecting: true});

    const { realName, nickname, password, server, port } = this.state;
    ConnectionActions.requestConnection({
      realName, nickname, password, server, port: parseInt(port, 10)
    });
  },

  render() {
    const inputGroupClass = 'input-group';
    const serverOptions = [
      'chat.freenode.net',
      'irc.abjects.net',
      'irc.allnetwork.org',
      'irc.dal.net',
      'irc.darksin.net',
      'irc.efnet.net',
      'irc.esper.net',
      'irc.foonetic.net',
      'irc.galaxynet.org',
      'irc.gamesurge.net',
      'irc.icq.com',
      'irc.za.ircnet.net',
      'irc.us.ircnet.net',
      'irc.fr.ircnet.net',
      'irc.irchighway.net',
      'irc.link-net.org',
      'irc.macnn.com',
      'irc.macgeneration.com',
      'irc.oftc.net',
      'irc.ogamenet.net',
      'irc.quakenet.org',
      'uk.quakenet.org',
      'irc.rizon.net',
      'irc.skyrock.com',
      'irc.synirc.net',
      'irc.swiftirc.net',
      'eu.undernet.org',
      'us.undernet.org',
      'chat1.ustream.tv',
      'irc.webchat.org',
      'irc.wyldryde.org'
    ];

    return (
      <form className="connection-creator" onSubmit={this.handleFormSubmission}>
        <div className={inputGroupClass}>
          <label>Real Name</label>
          <input type="text"
                 autoFocus
                 required
                 value={this.state.realName}
                 onChange={this.handleChange.bind(this, 'realName')} />
        </div>

        <div className={inputGroupClass}>
          <label>Nickname</label>
          <input type="text"
                 required
                 value={this.state.nickname}
                 onChange={this.handleChange.bind(this, 'nickname')} />
        </div>

        <div className={inputGroupClass}>
          <label>Password</label>
          <input type="password"
                 onChange={this.handleChange.bind(this, 'password')} />
        </div>

        <div className={inputGroupClass}>
          <label>Server</label>
          <select required
                  value={this.state.server}
                  onChange={this.handleChange.bind(this, 'server')}>
            <option value=""></option>
            {serverOptions.map((n, i) => {
              return <option value={n} key={i}>{n}</option>
            })}
          </select>
        </div>

        <div className={inputGroupClass}>
          <label>Port</label>
          <input type="number"
                 required
                 value={this.state.port}
                 onChange={this.handleChange.bind(this, 'port')} />
        </div>

        <div className={inputGroupClass}>
          <input type="submit" disabled={this.state.isConnecting} />
        </div>
      </form>
    );
  }
});

module.exports = component;

function contains(arr, thing) {
  return (arr.indexOf(thing) !== -1);
}
