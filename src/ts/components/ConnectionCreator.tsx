import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { connectToServer } from '../actions'
import { credentialsToId } from '../reducers/credentials'
import type { CreatorState, CredentialsT, IrcState } from '../flow'

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

const connector = connect((state: IrcState) => ({
  ...state.creator,
  savedCreds: state.credentials
}))

type Props = ConnectedProps<typeof connector>

class ConnectionCreator extends React.Component<Props> {
  render() {
    const { isConnecting, credentials, error, savedCreds, dispatch } =
      this.props
    const listItems = savedCreds.map((cred) => (
      <li
        className="saved-credentials"
        key={credentialsToId(cred)}
        onClick={() => {
          dispatch({
            type: 'CREDENTIALS_UPDATE',
            update: cred
          })
        }}
      >
        <p className="nickname">{cred.nickname}</p>
        <small>
          {cred.server}:{cred.port}
        </small>
        <button
          className="forget"
          onClick={(e) => {
            e.stopPropagation()
            dispatch({
              type: 'FORGET_CREDENTIALS',
              id: credentialsToId(cred)
            })
          }}
        >
          x
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
            onSubmit={(creds, remember) => {
              dispatch(connectToServer(creds, remember))
            }}
            onChange={(name, value) => {
              dispatch({
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
export default connector(ConnectionCreator)

const Panels = (props: {
  secondary: React.ReactNode
  children: React.ReactNode
}) => {
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
  disabled: boolean
  credentials: CredentialsT
  onChange: (name: string, value: string) => void
  onSubmit: (arg0: CredentialsT, arg1: boolean) => void
}

const Login = (props: LoginProps) => {
  const { realName, nickname, password, server, port } = props.credentials
  const [rememberCredentials, setRememberCredentials] = React.useState(false)
  const inputGroupClass = 'input-group'

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target
    props.onChange(name, value)
  }

  return (
    <form
      className="login-form"
      onSubmit={(event) => {
        event.preventDefault()
        props.onSubmit(props.credentials, rememberCredentials)
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
          disabled={props.disabled}
          onChange={handleChange}
        />
      </div>
      <div className={inputGroupClass}>
        <label>Nickname</label>
        <input
          type="text"
          required
          name="nickname"
          value={nickname}
          disabled={props.disabled}
          onChange={handleChange}
        />
      </div>
      <div className={inputGroupClass}>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={password}
          disabled={props.disabled}
          onChange={handleChange}
        />
      </div>
      <div className={inputGroupClass}>
        <label>Server</label>
        <input
          type="text"
          name="server"
          value={server}
          disabled={props.disabled}
          onChange={handleChange}
        />
      </div>
      <div className={inputGroupClass}>
        <label>Port</label>
        <input
          type="number"
          required
          name="port"
          value={port}
          disabled={props.disabled}
          onChange={handleChange}
        />
      </div>
      <label className="checkbox-label">
        <input
          type="checkbox"
          name="rememberCredentials"
          checked={rememberCredentials}
          onClick={(e: React.MouseEvent<HTMLInputElement>) => {
            if (
              e.target instanceof HTMLInputElement &&
              e.target.getAttribute('type') === 'checkbox'
            ) {
              setRememberCredentials(e.target.checked)
            }
          }}
        />{' '}
        remember credentials?
      </label>
      <div className={inputGroupClass}>
        <input type="submit" disabled={props.disabled} value="Log In" />
      </div>
    </form>
  )
}
