// @flow
/* global $Shape */
import React from 'react'
import { connect } from 'react-redux'
import type { Dispatch, IrcState } from '../flow'

type Props = {
  dispatch: Dispatch,
  isDark: boolean
}

class Settings extends React.Component<Props> {
  render() {
    const { dispatch, isDark } = this.props

    return (
      <div className="container settings">
        <h1>Settings</h1>
        <label>
          <input
            type="checkbox"
            checked={isDark}
            onChange={() => {
              dispatch({ type: 'TOGGLE_THEME' })
            }}
          />
          Dark Mode
        </label>
      </div>
    )
  }
}

export default connect(
  (state: IrcState, ownProps): $Shape<Props> => {
    if (state.route.view !== 'SETTINGS') throw new Error()
    return {
      isDark: state.ui.isDark
    }
  }
)(Settings)
