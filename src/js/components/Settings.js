// @flow
/* global $Shape */
import React from 'react'
import { connect } from 'react-redux'
import type { Dispatch, IrcState } from '../flow'

type Props = {
  dispatch: Dispatch,
  isDark: boolean,
  quitMsg: string
}

class Settings extends React.Component<Props> {
  render() {
    const { dispatch, isDark, quitMsg } = this.props

    return (
      <div className="container settings">
        <h1>Settings</h1>
        <div className="input-group">
          <label>Quit Message</label>
          <input
            type="text"
            style={{ background: 'inherit' }}
            value={quitMsg}
            onChange={e => {
              dispatch({ type: 'SET_QUIT_MSG', message: e.target.value })
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
                dispatch({ type: 'TOGGLE_THEME' })
              }}
            />
          </label>
        </div>
      </div>
    )
  }
}

export default connect(
  (state: IrcState, ownProps): $Shape<Props> => {
    if (state.route.view !== 'SETTINGS') throw new Error()
    return state.settings
  }
)(Settings)
