// @flow
import React from 'react'
import { connect } from 'react-redux'
import { connectToServer } from '../actions'
import { credentialsToId } from '../reducers/credentials'
import type { Dispatch, CreatorState, CredentialsT } from '../flow'

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

type Props = CreatorState & {
  dispatch: Dispatch,
  savedCreds: CredentialsT[]
}

class ConnectionCreator extends React.Component<Props> {
  render() {
    const { isConnecting, credentials, error, savedCreds } = this.props
    const listItems = savedCreds.map(cred => (
      <li className="saved-credentials" key={credentialsToId(cred)}>
        <button
          onClick={() => {
            this.props.dispatch({
              type: 'CREDENTIALS_UPDATE',
              update: cred
            })
          }}
        >
          <p className="nickname">{cred.nickname}</p>
          <small>
            {cred.server}:{cred.port}
          </small>
        </button>
      </li>
    ))
    return (
      <div className="container connection-creator">
        <Panels secondary={savedCreds.length ? <ul>{listItems}</ul> : null}>
          {error && (
            <div className="connection-error">
              <p>{error}</p>
            </div>
          )}
          <Login
            credentials={credentials}
            disabled={isConnecting}
            onSubmit={creds => {
              this.props.dispatch(connectToServer(creds))
            }}
            onChange={(name, value) => {
              this.props.dispatch({
                type: 'CREDENTIALS_UPDATE',
                update: {
                  [name]: value
                }
              })
            }}
          />
        </Panels>
      </div>
    )
  }
}

export default connect(state =>
  Object.assign({}, state.creator, { savedCreds: state.credentials })
)(ConnectionCreator)

const Panels = props => {
  if (props.secondary) {
    return (
      <React.Fragment>
        <div className="left-panel">{props.secondary}</div>
        <div className="right-panel">{props.children}</div>
      </React.Fragment>
    )
  } else {
    return <div className="full-panel">{props.children}</div>
  }
}

type LoginProps = {
  disabled: boolean,
  credentials: CredentialsT,
  onChange: (name: string, value: string) => void,
  onSubmit: CredentialsT => void
}

class Login extends React.Component<LoginProps> {
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

  handleChange(event) {
    const { name, value } = event.target
    this.props.onChange(name, value)
  }

  render() {
    const { disabled, credentials, onSubmit } = this.props
    const { realName, nickname, password, server, port } = credentials
    const inputGroupClass = 'input-group'
    return (
      <form
        className="login-form"
        onSubmit={event => {
          event.preventDefault()
          onSubmit(credentials)
        }}
      >
        <div className={inputGroupClass}>
          <label>Real Name</label>
          <input
            type="text"
            autoFocus
            required
            name="realName"
            value={realName}
            disabled={disabled}
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
            disabled={disabled}
            onChange={this.handleChange.bind(this)}
          />
        </div>
        <div className={inputGroupClass}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            disabled={disabled}
            onChange={this.handleChange.bind(this)}
          />
          {/*<label>
              remember password?{' '}
              <input
                type="checkbox"
                name="rememberPassword"
                onChange={this.handleRemember.bind(this)}
                onClick={this.handleRemember.bind(this)}
                checked={rememberPassword}
              />
            </label>*/}
        </div>
        <div className={inputGroupClass}>
          <label>Server</label>
          <input
            type="text"
            name="server"
            value={server}
            disabled={disabled}
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
            disabled={disabled}
            onChange={this.handleChange.bind(this)}
          />
        </div>
        <div className={inputGroupClass}>
          <input type="submit" disabled={disabled} value="Log In" />
        </div>
      </form>
    )
  }
}
