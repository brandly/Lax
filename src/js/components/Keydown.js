// @flow
import React from 'react'
import classNames from 'classnames'

type Props = {
  on: string,
  fn: void => void
};

class Keydown extends React.PureComponent<Props> {
  constructor (props) {
    super(props)
    this.handle = this.handle.bind(this)
  }

  componentDidMount () {
    document.addEventListener('keydown', this.handle)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handle)
  }

  handle (event: Event) {
    if (event.key === this.props.on) {
      this.props.fn()
    }
  }

  render () {
    return null
  }
}

export default Keydown
