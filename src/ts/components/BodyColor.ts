import * as React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import type { IrcState } from '../flow'

const connector = connect((state: IrcState, ownProps) => {
  return {
    isDark: state.settings.isDark
  }
})

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  children: React.ReactNode
}
const darkClass = 'theme-dark'

class BodyColor extends React.PureComponent<Props> {
  componentDidMount() {
    document.body &&
      document.body.classList.toggle(darkClass, this.props.isDark)
  }

  componentWillReceiveProps(nextProps: Props) {
    document.body && document.body.classList.toggle(darkClass, nextProps.isDark)
  }

  componentWillUnmount() {
    document.body && document.body.classList.remove(darkClass)
  }

  render() {
    return this.props.children
  }
}

export default connector(BodyColor)
