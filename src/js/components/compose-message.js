import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ConnectionStore from '../stores/connection-store';
import ChannelActions from '../actions/channel-actions';

const component = React.createClass({
  mixins: [PureRenderMixin],

  componentWillMount() {
    ConnectionStore.addChangeListener(this._onChange);
  },

  getInitialState() {
    return {
      message: '',
      nickname: ConnectionStore.getNickname()
    };
  },

  _onChange() {
    this.setState({
      nickname: ConnectionStore.getNickname()
    });
  },

  handleFormSubmission(event) {
    event.preventDefault();

    ChannelActions.sendMessage({
      channel: this.props.channel.name,
      message: this.state.message
    });

    this.setMessage('');
  },

  setMessage(message) {
    this.setState({ message });
  },

  handleChange(event) {
    this.setMessage(event.target.value);
  },

  render() {
    if (!this.props.channel) return null;

    return (
      <form className="message compose-message" onSubmit={this.handleFormSubmission}>
        <h3 className="nickname from">{this.state.nickname}</h3>
        <input type="text"
               placeholder="write message"
               className="body"
               required
               value={this.state.message}
               onChange={this.handleChange} />
      </form>
    );
  }
});

module.exports = component;
