// @flow
/* global $Shape */
import React from 'react'
import { connect } from 'react-redux'
import Connection from './Connection'
import ConnectionCreator from './ConnectionCreator'
import { listenToDocumentEvent } from '../actions/document'
import type {
  IrcState,
  RouteT,
  Dispatch
} from '../flow'

type Props = {
  route: RouteT,
  dispatch: Dispatch
};

class Router extends React.Component<Props> {
  unlisten: void => void;
  componentDidMount () {
    this.unlisten = this.props.dispatch(listenToDocumentEvent('visibilitychange', event => {
      return {
        type: 'VISIBILITY_CHANGE',
        visible: event.returnValue
      }
    }))
  }

  componentWillUnmount () {
    this.unlisten()
  }

  render () {
    const { route } = this.props
    switch (route.view) {
      case 'CONNECTION_CREATOR':
        return <ConnectionCreator />
      case 'CONNECTION':
        return <Connection />
    }
  }
}

export default connect((state: IrcState, ownProps): $Shape<Props> => {
  return {
    route: state.route
  }
})(Router)
