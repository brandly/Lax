import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import Connection from './Connection'
import Settings from './Settings'
import ConnectionSelector from './ConnectionSelector'
import ConnectionCreator from './ConnectionCreator'
import BodyColor from './BodyColor'
import { listenToDocumentEvent } from '../actions/document'
import type { IrcState, RouteT } from '../flow'

const connector = connect((state: IrcState, ownProps) => {
  return {
    route: state.route
  }
})

type Props = ConnectedProps<typeof connector>

const Router = (props: Props) => {
  React.useEffect(() => {
    // TODO: this doesn't seem right, i don't think we would clean up the event on dismount
    props.dispatch(
      listenToDocumentEvent('visibilitychange', (event) => {
        return {
          type: 'VISIBILITY_CHANGE',
          visible: event.returnValue
        }
      })
    )
  }, [props.dispatch])

  return (
    <BodyColor>
      <ConnectionSelector>
        <RouterContents {...props} />
      </ConnectionSelector>
    </BodyColor>
  )
}

const RouterContents = ({ route }: Pick<Props, 'route'>) => {
  switch (route.view) {
    case 'CONNECTION_CREATOR':
      return <ConnectionCreator />

    case 'CONNECTION':
      return <Connection />

    case 'SETTINGS':
      return <Settings />
  }
}

export default connector(Router)
