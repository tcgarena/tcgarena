import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {ErrorList} from '../index'
import formats from '../../utils/formats'
import deckCheck from '../../utils/deckCheck'
import {selectFormat, updateDeck} from '../../store'

class EditDeckForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      decklist: '',
      deckName: '',
      errors: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    // this.addDeck = this.addDeck.bind(this)
  }

  componentDidMount() {
    const decks = this.props.decks
    const id = this.props.match.params.id
    const deck = decks[id]
    this.setState({
      decklist: deck.list,
      deckName: deck.name
    })
  }

  updateDeck = async () => {
    const {decklist, deckName} = this.state
    const format = this.props.selectedFormat
    const id = this.props.match.params.id


    const {isLegal, errors} = await deckCheck(format, decklist, deckName)

    if (isLegal) {
      const deck = await this.props.updateDeck({id, format, decklist, deckName})
      this.props.history.push(`/decks/${deck.id}`)
    } else {
      this.setState({errors})
    }
  }

  handleChange(event) {
    // selectedFormat is handled by redux so we have to deal with it seperately
    if (event.target.name === 'selectedFormat')
      this.props.selectFormat(event.target.value)
    else {
      // every other form field is handled in local state
      const {name, value} = event.target
      this.setState({[name]: value})
    }
  }

  handleSubmit(event) {
    event.preventDefault()
    this.updateDeck()
  }

  render() {
    return (
      <div className="new-deck-form">
        <form className="new-deck-form" onSubmit={this.handleSubmit}>
          <input
            className="deck-name-field"
            name="deckName"
            type="text"
            onChange={this.handleChange}
            value={this.state.deckName}
          />
          <select
            name="selectedFormat"
            value={this.props.selectedFormat}
            onChange={this.handleChange}
          >
            {formats.map(format => (
              <option name="format" key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
          <textarea
            className="deck-field"
            name="decklist"
            value={this.state.decklist}
            onChange={this.handleChange}
          />
          <input type="submit" value="Submit" />
        </form>
        <ErrorList errors={this.state.errors} />
      </div>
    )
  }
}

const mapState = ({decks, user: {selectedFormat}}) => ({
  selectedFormat,
  decks
})

const mapDispatch = {
  selectFormat,
  updateDeck
}

export default withRouter(connect(mapState, mapDispatch)(EditDeckForm))
