import React from 'react'

class PeopleList extends React.Component {
  constructor (props) {
    super(props)
    this.state = { filter: '' }
  }

  setFilteredValue (filter) {
    this.setState({ filter })
  }

  handleChange (event) {
    this.setFilteredValue(event.target.value)
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
            type="search"
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
