import React from 'react'
import {connect} from 'react-redux'
import {selectDeck, deleteDeck, deselectDeck} from '../../store'
import {ConfirmAction} from '../index'

class DeckItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isHovering: false,
      isDeleting: false
    }
    this.handleMouseHover = this.handleMouseHover.bind(this)
    this.toggleDeleteState = this.toggleDeleteState.bind(this)
    this.deleteDeck = this.deleteDeck.bind(this)
  }

  handleMouseHover = deckId => {
    this.props.preview(deckId)
    this.setState(this.toggleHoverState)
  }

  toggleHoverState = state => ({isHovering: !state.isHovering})
  toggleDeleteState = () => {
    this.setState({isDeleting: !this.state.isDeleting})
  }

  deleteDeck() {
    const {deck, history} = this.props
    this.props.deleteDeck(deck.id.toString())
    history.push('/decks')
    this.props.deselectDeck()

  }

  showButtons() {
    const {deck, history, actionButton} = this.props
    const {isDeleting} = this.state
    return (
      <div>
        {isDeleting ? (
          <div className='deck-item-buttons'>
            <ConfirmAction
              confirm={this.deleteDeck}
              deny={this.toggleDeleteState}
              confirmText={'Delete'}
              denyText={'Cancel'}
              text={false}
              />
          </div>
        ) : (
          <div className='deck-item-buttons'>
            {/* action button is the first button */}

            <button
              type="button"
              onClick={() => actionButton.action(deck.id)}
            >
              {actionButton.text}
            </button>

            <button
              type="button"
              onClick={() => history.push(`/decks/${deck.id}/edit`)}
            >
              Edit
            </button>

            <button type="button" onClick={this.toggleDeleteState}>
              Delete
            </button>
          </div>
        )}
      </div>
    )
  }

  render() {
    const {deck} = this.props
    return (
      <div
        className="deck-item-container"
        onMouseEnter={() => this.handleMouseHover(deck.id)}
        onMouseLeave={() => this.handleMouseHover(null)}
        onMouseOver={() => {
          if (!this.state.isHovering)
            this.handleMouseHover(deck.id)
        }}
        onClick={this.handleClick}
      >
        <p>{deck.name}</p>
        {this.state.isHovering && this.showButtons()}
      </div>
    )
  }
}

const mapState = ({decks, user: {selectedFormat}}) => ({
  decks,
  selectedFormat
})

const mapDispatch = {
  selectDeck,
  deleteDeck,
  deselectDeck
}

export default connect(mapState, mapDispatch)(DeckItem)
