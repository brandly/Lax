// @flow
/* global SyntheticEvent, HTMLInputElement */
import React from 'react'

type Props = {
  // onJoin: string => void
}

type State = {}

class Settings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  //
  //   handleChange(event: SyntheticEvent<*>) {
  //     if (event.target instanceof HTMLInputElement) {
  //       this.setChannelName(event.target.value)
  //     }
  //   }
  //
  //   handleFormSubmission(event: SyntheticEvent<*>) {
  //     event.preventDefault()
  //     this.props.onJoin(this.state.channelName)
  //     this.setChannelName('')
  //   }

  render() {
    return (
      <div>
        <h1>Settings</h1>
      </div>
    )
  }
}

export default Settings
