import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {ErrorList, FormatSelect} from '../index'
import deckCheck from '../../utils/deckCheck'
import { saveDeck, updateDeck, selectDeck} from '../../store'

class DeckForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      decklist: '',
      deckName: '',
      errors: [],
      isEdit: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.addDeck = this.addDeck.bind(this)
  }

  async addDeck() {
    const {decklist, deckName} = this.state
    const format = this.props.selectedFormat
    const {deckId} = this.props.match.params

    const {isLegal, errors} = await deckCheck(format, decklist, deckName)

    if (isLegal) {
      const deck = await this.props.saveDeck({
        format,
        decklist,
        deckName,
        deckId
      })
      this.props.selectDeck(deck.id)
      this.props.history.push(`/decks/${deck.id}`)
    } else this.setState({errors})
  }

  componentDidMount() {
    const {action} = this.props.match.params
    if (action === 'edit') {
      const {deckId} = this.props.match.params
      const {list: decklist, name: deckName} = this.props.decks[deckId]
      this.setState({
        decklist, deckName,
        isEdit: true
      })
    }
  }
  handleChange(event) {
    const {name, value} = event.target
    this.setState({[name]: value})
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
          { !this.state.isEdit && <FormatSelect /> }
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
  selectDeck,
  saveDeck
}

const mapEdit = dispatch => ({
  selectDeck,
  saveDeck: deck => dispatch(updateDeck(deck))
})

export const AddDeckForm = withRouter(connect(mapState, mapAdd)(DeckForm))
export const EditDeckForm = withRouter(connect(mapState, mapEdit)(DeckForm))
