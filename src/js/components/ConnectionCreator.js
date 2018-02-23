// @flow
import React from 'react'
import { connect } from 'react-redux'
import { connectToServer } from '../actions'
import type { Dispatch } from '../flow'

type Props = {
  dispatch: Dispatch
};

type State = {
  storedKeys: Array<string>,
  isConnecting: boolean,
  realName: string,
  nickname: string,
  server: string,
  port: string,
  password: string
};

class ConnectionCreator extends React.Component<Props, State> {
  constructor (props) {
    super(props)
    const storedKeys = ['realName', 'nickname', 'server', 'port']

    const state = {
      storedKeys,
      isConnecting: false,
      realName: '',
      nickname: '',
      server: '',
      port: '',
      password: ''
    }

    storedKeys.forEach(key => {
      state[key] = window.localStorage[key] || ''
    })

    this.state = state
  }

  handleChange (key, event) {
    const { value } = event.target

    if (this.state.storedKeys.includes(key)) {
      window.localStorage[key] = value
    }

    this.setState({
      [key]: value
    })
  }

  handleFormSubmission (event) {
    event.preventDefault()
    this.setState({ isConnecting: true })

    const { realName, nickname, password, server, port } = this.state
    this.props.dispatch(connectToServer({ realName, nickname, password, server, port: parseInt(port, 10) }))
  }

  render () {
    const inputGroupClass = 'input-group'
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
    ]

    return (
      <form className="connection-creator" onSubmit={this.handleFormSubmission.bind(this)}>
        <div className={inputGroupClass}>
          <label>Real Name</label>
          <input type="text"
            autoFocus
            required
            value={this.state.realName}
            disabled={this.state.isConnecting}
            onChange={this.handleChange.bind(this, 'realName')} />
        </div>

        <div className={inputGroupClass}>
          <label>Nickname</label>
          <input type="text"
            required
            value={this.state.nickname}
            disabled={this.state.isConnecting}
            onChange={this.handleChange.bind(this, 'nickname')} />
        </div>

        <div className={inputGroupClass}>
          <label>Password</label>
          <input type="password"
            disabled={this.state.isConnecting}
            onChange={this.handleChange.bind(this, 'password')} />
        </div>

        <div className={inputGroupClass}>
          <label>Server</label>
          <select required
            value={this.state.server}
            disabled={this.state.isConnecting}
            onChange={this.handleChange.bind(this, 'server')}>
            <option value="" />
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
            disabled={this.state.isConnecting}
            onChange={this.handleChange.bind(this, 'port')} />
        </div>

        <div className={inputGroupClass}>
          <input
            type="submit"
            disabled={this.state.isConnecting}
            value="Log In"
          />
        </div>
      </form>
    )
  }
}

export default connect(state => ({}))(ConnectionCreator)
