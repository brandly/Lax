// @flow
/* global SyntheticEvent, HTMLInputElement */
import React from 'react'
import Keydown from './Keydown'
import sortBy from '../modules/sortBy'
import type { PersonT } from '../flow'

type Props = {
  people: Array<PersonT>,
  onCloseRequest: () => void
}

type State = {
  filter: string
}

const byName = sortBy(p => p.name.toLowerCase())

class PeopleList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { filter: '' }
  }

  setFilteredValue(filter: string) {
    this.setState({ filter })
  }

  handleChange(event: SyntheticEvent<*>) {
    if (event.target instanceof HTMLInputElement) {
      this.setFilteredValue(event.target.value)
    }
  }

  render() {
    const { people } = this.props
    if (!people) return null

    const peopleElements =
      people
        .filter(p => p.name.toLowerCase().includes(this.state.filter))
        .sort(byName)
        .map((person, i) =>
          <h3 className="nickname" key={i}>{person.name}</h3>
        )

    return (
      <div className="people-list">
        <Keydown on="Escape" fn={this.props.onCloseRequest} />
        <div className="header channel-header">
          <input
            type="text"
            placeholder={[
              'search',
              people.length,
              (people.length === 1 ? 'person' : 'people')
            ].join(' ')}
            className="people-search-field"
            autoFocus
            onChange={this.handleChange.bind(this)}
          />
        </div>
        <div className="scrolling-panel">
          {peopleElements}
        </div>
      </div>
    )
  }
}

export default PeopleList
