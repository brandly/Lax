// @flow
import React from 'react'
import { connect } from 'react-redux'
import Connection from './Connection'
import ConnectionCreator from './ConnectionCreator'
import type {
  IrcState,
  RouteT
} from '../flow'

type Props = {
  route: RouteT
};

const Router = ({ route }: Props) => {
  switch (route.view) {
    case 'CONNECTION_CREATOR':
      return <ConnectionCreator />
    case 'CONNECTION':
      return <Connection />
  }
}

export default connect((state: IrcState, ownProps): Props => {
  return {
    route: state.route
  }
})(Router)
