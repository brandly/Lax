// @flow
import React from 'react'
import { connect } from 'react-redux'
import { connectToServer } from '../actions'
import type { Dispatch } from '../flow'

const serverOptions = [
  '10.4.135.1',
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
  dispatch: Dispatch
};

type State = {
  isConnecting: boolean,
  realName: string,
  nickname: string,
  server: string,
  port: string,
  password: string,
  rememberPassword: boolean
};

const { localStorage } = window
const storedKeys = ['realName', 'nickname', 'server', 'port']
class ConnectionCreator extends React.Component<Props, State> {
  constructor (props) {
    super(props)

    this.state = {
      isConnecting: false,
      realName: '',
      nickname: '',
      server: '',
      port: '',
      password: '',
      rememberPassword: localStorage.rememberPassword === 'true' || false
    }

    this.getStoredKeys().forEach(key => {
      this.state[key] = localStorage[key] || ''
    })
  }

  getStoredKeys () {
    return this.state.rememberPassword ? storedKeys.concat('password') : storedKeys
  }

  handleChange (event) {
    const { name, value } = event.target

    if (this.getStoredKeys().includes(name)) {
      localStorage[name] = value
    }

    this.setState({
      [name]: value
    })
  }

  handleRemember (event) {
    const { name, checked } = event.target
    localStorage[name] = checked
    this.setState({
      [name]: checked
    })

    if (checked) {
      localStorage.password = this.state.password
    } else {
      localStorage.removeItem('password')
    }
  }

  handleFormSubmission (event) {
    event.preventDefault()
    this.setState({ isConnecting: true })

    const { realName, nickname, password, server, port } = this.state
    this.props.dispatch(connectToServer({ realName, nickname, password, server, port: parseInt(port, 10) }))
  }

  render () {
    const inputGroupClass = 'input-group'

    return (
      <form className="connection-creator" onSubmit={this.handleFormSubmission.bind(this)}>
        <div className={inputGroupClass}>
          <label>Real Name</label>
          <input
            type="text"
            autoFocus
            required
            name="realName"
            value={this.state.realName}
            disabled={this.state.isConnecting}
            onChange={this.handleChange.bind(this)} />
        </div>

        <div className={inputGroupClass}>
          <label>Nickname</label>
          <input
            type="text"
            required
            name="nickname"
            value={this.state.nickname}
            disabled={this.state.isConnecting}
            onChange={this.handleChange.bind(this)} />
        </div>

        <div className={inputGroupClass}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={this.state.password}
            disabled={this.state.isConnecting}
            onChange={this.handleChange.bind(this)} />
          <label>
            remember password? <input
              type="checkbox"
              name="rememberPassword"
              onChange={this.handleRemember.bind(this)}
              onClick={this.handleRemember.bind(this)}
              checked={this.state.rememberPassword}
            />
          </label>
        </div>

        <div className={inputGroupClass}>
          <label>Server</label>
          <select
            required
            name="server"
            value={this.state.server}
            disabled={this.state.isConnecting}
            onChange={this.handleChange.bind(this)}>
            <option value="" />
            {serverOptions.map((n, i) => {
              return <option value={n} key={i}>{n}</option>
            })}
          </select>
        </div>

        <div className={inputGroupClass}>
          <label>Port</label>
          <input
            type="number"
            required
            name="port"
            value={this.state.port}
            disabled={this.state.isConnecting}
            onChange={this.handleChange.bind(this)} />
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
