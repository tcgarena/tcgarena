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

  toggleHoverState = state => ({ isHovering: !state.isHovering })
  toggleDeleteState = () => { this.setState({isDeleting: !this.state.isDeleting}) }

  deleteDeck() {
    const {deck, history} = this.props
    this.props.deleteDeck(deck.id)
    this.props.deselectDeck()
    history.push('/decks')
  }

  showButtons() {
    const {deck, history, actionButton} = this.props
    const {isDeleting} = this.state
    return (
      <div className='deck-item-container'>
        { isDeleting 
            ? <ConfirmAction 
                confirm={this.deleteDeck}
                deny ={this.toggleDeleteState}
              />
            : <div className='deck-item'>

                {/* action button is the first button */}

                <button className='small-button' onClick={() => 
                  actionButton.action(deck.id)
                }>
                  {actionButton.text}
                </button>

                <button onClick={() => history.push(`/decks/${deck.id}/edit`)}>
                  Edit
                </button>

                <button onClick={this.toggleDeleteState}>
                  Delete
                </button>
            </div>
        }
      </div>
    )
  }

  render() {
    const {deck} = this.props
    return (
      <div
        className="single-deck-list"
        onMouseEnter={() => this.handleMouseHover(deck.id)}
        onMouseLeave={() => this.handleMouseHover(null)}
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
