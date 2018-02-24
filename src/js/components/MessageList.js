// @flow
/* global HTMLDivElement HTMLAnchorElement */
import React from 'react'
import { findDOMNode } from 'react-dom'
import classNames from 'classnames'
import Linkify from 'react-linkify'
import { shell } from 'electron'
import type { MessageT } from '../flow'

type Props = {
  messages: Array<MessageT>
};

type State = {
  isBrowsingPriorMessages: boolean
};

class MessageList extends React.PureComponent<Props, State> {
  scrollListener: EventHandler;
  constructor (props: Props) {
    super(props)
    this.state = {
      isBrowsingPriorMessages: false
    }
  }

  componentDidMount () {
    const el = findDOMNode(this.refs.scroller)

    this.scrollListener = () => {
      if (el instanceof HTMLDivElement) {
        const isScrolledToBottom = el.scrollTop === (el.scrollHeight - el.offsetHeight)
        this.setState({ isBrowsingPriorMessages: !isScrolledToBottom })
      }
    }

    el && el.addEventListener('scroll', this.scrollListener)
  }

  componentWillUnmount () {
    const el = findDOMNode(this.refs.scroller)
    el && el.removeEventListener('scroll', this.scrollListener)
  }

  scrollToBottom () {
    const el = findDOMNode(this.refs.scroller)
    if (el instanceof HTMLDivElement) {
      el.scrollTop = el.scrollHeight
    }
  }

  componentDidUpdate (nextProps: Props) {
    const isDifferentChannel = nextProps.messages[0] !== this.props.messages[0]
    if (isDifferentChannel || !this.state.isBrowsingPriorMessages) {
      this.scrollToBottom()
    }
  }

  render () {
    const { messages } = this.props

    if (!messages) {
      return null
    }

    return (
      <div className="scrolling-panel" ref="scroller">
        <ul className="message-list">
          {messages.map((msg, i) => {
            const showFrom = (i === 0 || messages[i - 1].from !== msg.from)

            return <Message key={msg.id} msg={msg} showFrom={showFrom} />
          })}
        </ul>
      </div>
    )
  }
}

type MessageProps = {
  msg: MessageT,
  showFrom: boolean
};
class Message extends React.PureComponent<MessageProps> {
  handleLink (event: Event) {
    event.preventDefault()
    if (event.target instanceof HTMLAnchorElement) {
      const url = event.target.href
      shell.openExternal(url)
    }
  }

  renderText (text: string) {
    return text.split('\n').map((text, index) => {
      // TODO: should probably handle this with CSS
      const Wrap = ({ children }) => {
        if (index === 0) {
          return <span className="text">{children}</span>
        } else {
          return <p className="text">{children}</p>
        }
      }
      return (
        <Wrap key={index}>
          <Linkify properties={{onClick: this.handleLink.bind(this)}}>{text}</Linkify>
        </Wrap>
      )
    })
  }

  render () {
    const { msg, showFrom } = this.props
    const action = (msg.type !== 'priv') ? <span className="command">{msg.type}</span> : null

    const classes = classNames({
      message: true,
      [msg.type]: true
    })

    return (
      <li className={classes}>
        <h3 className="nickname from">{showFrom ? msg.from : ''}</h3>
        <div className="body">{action}{this.renderText(msg.text)}</div>
        <p className="when">{formatDate(msg.when)}</p>
      </li>
    )
  }
}

function formatDate (d: Date): string {
  let hours = d.getHours()
  const meridian = hours < 12 ? 'AM' : 'PM'

  if (hours === 0) {
    hours = 12
  } else if (hours > 12) {
    hours = hours - 12
  }
  return `${hours}:${twoDigits(d.getMinutes())} ${meridian}`
}

function twoDigits (str: string | number): string {
  str = '' + str
  return (str.length < 2) ? ('0' + str) : str
}

export default MessageList
