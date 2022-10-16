import React from 'react'
import type { ConnectionT } from '../flow'
type Props = {
  connection: ConnectionT
  onClick: (arg0: void) => void
}

const ConnectionHeader = ({ connection, onClick }: Props) => {
  return (
    <div className="header connection-header">
      <h2
        className="vertical-center server"
        onClick={() => {
          onClick()
        }}
      >
        {connection.server}
      </h2>
    </div>
  )
}

export default ConnectionHeader
