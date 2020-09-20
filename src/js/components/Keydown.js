// @flow
import React from 'react'

type Props = {
  on: string,
  fn: (void) => void
}

class Keydown extends React.PureComponent<Props> {
  _handle: (KeyboardEvent) => void
  constructor(props: Props) {
    super(props)
    this._handle = this.handle.bind(this)
  }

  componentDidMount() {
    document.addEventListener('keydown', this._handle)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this._handle)
  }

  handle(event: KeyboardEvent) {
    if (event.key === this.props.on) {
      this.props.fn()
    }
  }

  render() {
    return null
  }
}

export default Keydown
