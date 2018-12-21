import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {ErrorList} from '../index'
import formats from '../../utils/formats'
import deckCheck from '../../utils/deckCheck'
import {selectFormat, saveDeck, updateDeck, selectDeck} from '../../store'

class DeckForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      decklist: '',
      deckName: '',
      errors: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.addDeck = this.addDeck.bind(this)
  }

  async addDeck() {
    const {decklist, deckName} = this.state
    const {deckId} = this.props.match.params
    const format = this.props.selectedFormat

    const {isLegal, errors} = await deckCheck(format, decklist, deckName)

    if (isLegal) {
      const {id} = this.props.match.params
      const deck = await this.props.saveDeck({format, decklist, deckName, id})
      // console.log('deck', deck)
      this.props.selectDeck(deck.id)
      this.props.history.push(`/decks/${deckId}`)
    } else this.setState({errors})

  }

  componentDidMount() {
    const {deckId} = this.props.match.params

    if (deckId) {
      const {list: decklist, name: deckName} = this.props.decks[deckId]
      this.setState({decklist, deckName})
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
    this.addDeck()
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

const mapAdd = {
  selectFormat,
  selectDeck,
  saveDeck
}

const mapEdit = dispatch => ({
  selectFormat, selectDeck,
  saveDeck: deck => dispatch(updateDeck(deck))
})

export const AddDeckForm = withRouter(
  connect(mapState, mapAdd)(DeckForm)
)
export const EditDeckForm = withRouter(
  connect(mapState, mapEdit)(DeckForm)
)
