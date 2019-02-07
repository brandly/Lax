// @flow
import React from 'react'
import { connect } from 'react-redux'
import { connectToServer } from '../actions'
import type { Dispatch, CreatorState } from '../flow'

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

if (process.env.NODE_ENV !== 'production') {
  serverOptions.unshift('127.0.0.1')
}

type Props = {
  dispatch: Dispatch,
  connection: CreatorState
}

const { localStorage } = window
const storedKeys = ['realName', 'nickname', 'server', 'port']
class ConnectionCreator extends React.Component<Props> {
  constructor(props) {
    super(props)

    // this.getStoredKeys().forEach(key => {
    //   this.state[key] = localStorage[key] || ''
    // })
  }

  // getStoredKeys() {
  //   return this.state.rememberPassword
  //     ? storedKeys.concat('password')
  //     : storedKeys
  // }

  handleChange(event) {
    const { name, value } = event.target
    // if (this.getStoredKeys().includes(name)) {
    //   localStorage[name] = value
    // }
    this.props.dispatch({
      type: 'CONNECTION_CREATOR_UPDATE',
      update: {
        [name]: value
      }
    })
  }

  handleRemember(event) {
    // const { name, checked } = event.target
    // localStorage[name] = checked
    // this.setState({
    //   [name]: checked
    // })
    // if (checked) {
    //   localStorage.password = this.state.password
    // } else {
    //   localStorage.removeItem('password')
    // }
  }

  handleFormSubmission(event) {
    event.preventDefault()

    const { realName, nickname, password, server, port } = this.props.connection
    this.props.dispatch(
      connectToServer({
        realName,
        nickname,
        password,
        server,
        port: parseInt(port, 10)
      })
    )
  }

  render() {
    const inputGroupClass = 'input-group'
    const {
      realName,
      nickname,
      password,
      server,
      port,
      isConnecting,
      rememberPassword
    } = this.props.connection

    return (
      <form
        className="connection-creator"
        onSubmit={this.handleFormSubmission.bind(this)}
      >
        <div className={inputGroupClass}>
          <label>Real Name</label>
          <input
            type="text"
            autoFocus
            required
            name="realName"
            value={realName}
            disabled={isConnecting}
            onChange={this.handleChange.bind(this)}
          />
        </div>

        <div className={inputGroupClass}>
          <label>Nickname</label>
          <input
            type="text"
            required
            name="nickname"
            value={nickname}
            disabled={isConnecting}
            onChange={this.handleChange.bind(this)}
          />
        </div>

        <div className={inputGroupClass}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            disabled={isConnecting}
            onChange={this.handleChange.bind(this)}
          />
          <label>
            remember password?{' '}
            <input
              type="checkbox"
              name="rememberPassword"
              onChange={this.handleRemember.bind(this)}
              onClick={this.handleRemember.bind(this)}
              checked={rememberPassword}
            />
          </label>
        </div>

        <div className={inputGroupClass}>
          <label>Server</label>
          <input
            type="text"
            name="server"
            value={server}
            disabled={isConnecting}
            onChange={this.handleChange.bind(this)}
          />
        </div>

        <div className={inputGroupClass}>
          <label>Port</label>
          <input
            type="number"
            required
            name="port"
            value={port}
            disabled={isConnecting}
            onChange={this.handleChange.bind(this)}
          />
        </div>

        <div className={inputGroupClass}>
          <input type="submit" disabled={isConnecting} value="Log In" />
        </div>
      </form>
    )
  }
}

export default connect(state => ({
  connection: state.route.state
}))(ConnectionCreator)
