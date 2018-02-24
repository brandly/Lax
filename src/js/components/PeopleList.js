// @flow
/* global SyntheticEvent, HTMLInputElement */
import React from 'react'
import type { PersonT } from '../flow'

type Props = {
  people: Array<PersonT>
};

type State = {
  filter: string
};

class PeopleList extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = { filter: '' }
  }

  setFilteredValue (filter: string) {
    this.setState({ filter })
  }

  handleChange (event: SyntheticEvent<*>) {
    if (event.target instanceof HTMLInputElement) {
      this.setFilteredValue(event.target.value)
    }
  }

  render () {
    const { people } = this.props
    if (!people) return null

    const peopleElements =
      people
        .filter(p => p.name.toLowerCase().includes(this.state.filter))
        // .sortBy(p => p.name.toLowerCase())
        .map((person, i) =>
          <h3 className="nickname" key={i}>{person.name}</h3>
        )

    return (
      <div className="people-list">
        <div className="scrolling-panel">
          <input
            type="text"
            placeholder="search..."
            className="people-search-field"
            autoFocus
            onChange={this.handleChange.bind(this)}
          />
          {peopleElements}
        </div>
      </div>
    )
  }
}

export default PeopleList
