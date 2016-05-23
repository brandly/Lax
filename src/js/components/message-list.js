import React from 'react'
import { findDOMNode } from 'react-dom'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import classNames from 'classnames'
import Linkify from 'react-linkify'

import { shell } from 'electron'

const MessageList = React.createClass({
  mixins: [PureRenderMixin],

  scrollToBottom () {
    const el = findDOMNode(this.refs.scroller)
    el.scrollTop = el.scrollHeight
  },

  componentDidUpdate () {
    this.scrollToBottom()
  },

  handleLink (event) {
    event.preventDefault()
    const url = event.target.href
    shell.openExternal(url)
  },

  renderMessage (text) {
    return (
      <span className="text">
        <Linkify properties={{onClick: this.handleLink}}>{text}</Linkify>
      </span>
    )
  },

  render () {
    const { messages } = this.props

    if (!messages) {
      return null
    }

    const messageElements = messages.map((msg, i) => {
      const action = (msg.type !== 'priv') ? <span className="command">{msg.type}</span> : null
      const showFrom = (i === 0 || messages.get(i - 1).from !== msg.from)

      const classes = classNames({
        message: true,
        [msg.type]: true
      })

      return (
        <li className={classes} key={i}>
          <h3 className="nickname from">{showFrom ? msg.from : ''}</h3>
          <p className="body">{action}{this.renderMessage(msg.message)}</p>
          <p className="when">{formatDate(msg.when)}</p>
        </li>
      )
    })

    return (
      <div className="scrolling-panel" ref="scroller">
        <ul className="message-list">
          {messageElements.toArray()}
        </ul>
      </div>
    )
  }
})

function formatDate (d) {
  return `${twoDigits(d.getHours())}:${twoDigits(d.getMinutes())}:${twoDigits(d.getSeconds())}`
}

function twoDigits (str) {
  str = '' + str
  return (str.length < 2) ? ('0' + str) : str
}

export default MessageList
