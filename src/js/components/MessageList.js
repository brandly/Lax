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

class MessageList extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      isBrowsingPriorMessages: false
    }
  }

  componentDidMount () {
    const el = findDOMNode(this.refs.scroller)

    this.scrollListener = () => {
      const isScrolledToBottom = el.scrollTop === (el.scrollHeight - el.offsetHeight)
      this.setState({ isBrowsingPriorMessages: !isScrolledToBottom })
    }

    el.addEventListener('scroll', this.scrollListener)
  }

  componentWillUnmount () {
    const el = findDOMNode(this.refs.scroller)
    el.removeEventListener('scroll', this.scrollListener)
  }

  scrollToBottom () {
    const el = findDOMNode(this.refs.scroller)
    el.scrollTop = el.scrollHeight
  }

  componentDidUpdate (nextProps) {
    const isDifferentChannel = nextProps.messages[0] !== this.props.messages[0]
    if (isDifferentChannel || !this.state.isBrowsingPriorMessages) {
      this.scrollToBottom()
    }
  }

  handleLink (event) {
    event.preventDefault()
    const url = event.target.href
    shell.openExternal(url)
  }

  renderMessage (text: string) {
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
    const { messages } = this.props

    if (!messages) {
      return null
    }

    const messageElements = messages.map((msg, i) => {
      const action = (msg.type !== 'priv') ? <span className="command">{msg.type}</span> : null
      const showFrom = (i === 0 || messages[i - 1].from !== msg.from)

      const classes = classNames({
        message: true,
        [msg.type]: true
      })

      return (
        <li className={classes} key={msg.id}>
          <h3 className="nickname from">{showFrom ? msg.from : ''}</h3>
          <div className="body">{action}{this.renderMessage(msg.text)}</div>
          <p className="when">{formatDate(msg.when)}</p>
        </li>
      )
    })

    return (
      <div className="scrolling-panel" ref="scroller">
        <ul className="message-list">
          {messageElements}
        </ul>
      </div>
    )
  }
}

function formatDate (d: Date): string {
  return `${twoDigits(d.getHours())}:${twoDigits(d.getMinutes())}:${twoDigits(d.getSeconds())}`
}

function twoDigits (str: string | number): string {
  str = '' + str
  return (str.length < 2) ? ('0' + str) : str
}

export default MessageList
