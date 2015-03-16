import React from 'react';
import { addons } from 'react/addons';

const component = React.createClass({
  mixins: [addons.PureRenderMixin],

  getInitialState() {
    return {};
  },

  handleFormSubmission(event) {
    event.preventDefault();
    // TODO: fire action
  },

  render() {
    return (
      <form className="form-panel" onSubmit={this.handleFormSubmission}>
        <input type="text"
               placeholder="new message"
               required />
      </form>
    );
  }
});

module.exports = component;
