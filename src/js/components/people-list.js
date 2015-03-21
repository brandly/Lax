import React from 'react';
import { addons } from 'react/addons';
import { List } from 'immutable';

const component = React.createClass({
  mixins: [addons.PureRenderMixin],

  getInitialState() {
     return { filter: '' };
  },

  setFilteredValue(filter) {
    this.setState({ filter });
  },

  handleChange(event) {
    this.setFilteredValue(event.target.value);
  },

  render() {
    const { people } = this.props;
    if (!people) return null;

    const peopleElements = people.filter(p => contains(p.name.toLowerCase(), this.state.filter))
                                 .sortBy(p => p.name.toLowerCase())
                                 .map(person => {
      return <h3 className="nickname">{person.name}</h3>;
    });

    return (
      <div className="people-list">
        <div className="scrolling-panel">
          <input type="search"
                 placeholder="search..."
                 className="people-search-field"
                 autoFocus
                 onChange={this.handleChange} />
          {peopleElements}
        </div>
      </div>
    );
  }
});

module.exports = component;

function contains(a, b) {
  return a.indexOf(b) !== -1;
}
