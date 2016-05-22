import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ConnectionStore from '../stores/connection-store'

function getServer () {
  return {
    server: ConnectionStore.server
  }
}

const ConnectionHeader = React.createClass({
  mixins: [PureRenderMixin],

  componentWillMount () {
    ConnectionStore.addChangeListener(this._onChange)
  },

  getInitialState () {
    return getServer()
  },

  _onChange () {
    this.setState(getServer())
  },

  render () {
    return (
      <div className="header connection-header">
        <h2 className="vertical-center server">{this.state.server}</h2>
      </div>
    )
  }
})

export default ConnectionHeader
