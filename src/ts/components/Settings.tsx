import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { shell } from 'electron'
import type { IrcState } from '../flow'
// import pkg from '../../../package.json'
// TODO: read this file in more manually?
const pkg = { name: 'Lax', version: '0.0.0' }

const connector = connect((state: IrcState, ownProps) => {
  if (state.route.view !== 'SETTINGS') throw new Error()
  return state.settings
})

type Props = ConnectedProps<typeof connector>

class Settings extends React.Component<Props> {
  render() {
    const { dispatch, isDark, quitMessage } = this.props
    return (
      <div className="container settings">
        <h1>Settings</h1>
        <div className="input-group">
          <label>Quit Message</label>
          <input
            type="text"
            style={{
              background: 'inherit'
            }}
            value={quitMessage}
            onChange={(e) => {
              dispatch({
                type: 'SET_QUIT_MSG',
                message: e.target.value
              })
            }}
          />
        </div>
        <div className="input-group">
          <label>
            Dark Mode
            <input
              type="checkbox"
              checked={isDark}
              onChange={() => {
                dispatch({
                  type: 'TOGGLE_THEME'
                })
              }}
            />
          </label>
        </div>
        <p>
          {pkg.name} v{pkg.version} ∙{' '}
          <a
            href="https://github.com/brandly/Lax/issues/new"
            onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
              e.preventDefault()
              if (e.target instanceof HTMLAnchorElement) {
                shell.openExternal(e.target.href)
              }
            }}
          >
            Report an issue
          </a>
        </p>
      </div>
    )
  }
}

export default connector(Settings)
