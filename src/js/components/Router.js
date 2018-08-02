// @flow
/* global $Shape */
import React from 'react'
import { connect } from 'react-redux'
import Connection from './Connection'
import ConnectionSelector from './ConnectionSelector'
import ConnectionCreator from './ConnectionCreator'
import BodyColor from './BodyColor'
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

  renderContents () {
    const { route } = this.props
    switch (route.view) {
      case 'CONNECTION_CREATOR':
        return <ConnectionCreator />
      case 'CONNECTION':
        return <Connection />
    }
  }

  render () {
    return (
      <BodyColor>
        <ConnectionSelector>
          {this.renderContents()}
        </ConnectionSelector>
      </BodyColor>
    )
  }
}

export default connect((state: IrcState, ownProps): $Shape<Props> => {
  return {
    route: state.route
  }
})(Router)
