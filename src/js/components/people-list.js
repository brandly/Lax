import React from 'react';
import { addons } from 'react/addons';
import { List } from 'immutable';

const component = React.createClass({
  mixins: [addons.PureRenderMixin],

  render() {
    const { people } = this.props;
    if (!people) return null;

    const peopleElements = people.sortBy(p => p.name.toLowerCase()).map(person => {
      return <h3 className="nickname">{person.name}</h3>;
    });

    return (
      <div className="people-list">
        <div className="scrolling-panel">
          {peopleElements}
        </div>
      </div>
    );
  }
});

module.exports = component;
