// @flow
import React from 'react'
import classNames from 'classnames'

type Props = {
  name: string,
  unreadCount?: number
}

function splitOnHash(str) {
  let hash = ''
  while (str[0] === '#') {
    hash += str[0]
    str = str.slice(1)
  }
  return [hash, str]
}

const ChannelName = (props: Props) => {
  const { unreadCount = 0, name } = props
  const [hash, nameWithoutHash] = splitOnHash(name)

  return (
    <span
      className={classNames('channel-name', {
        'has-unread': unreadCount > 0
      })}
    >
      {hash ? <span className="channel-prefix">{hash}</span> : null}
      {nameWithoutHash}
    </span>
  )
}

export default ChannelName
