import React from 'react'
import {connect} from 'react-redux'
import {selectDeck} from '../../store'

class DecksList_SingleDeck extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isHovering: false
    }
    this.handleMouseHover = this.handleMouseHover.bind(this)
  }

  handleMouseHover = deckId => {
    this.props.preview(deckId)
    this.setState(this.toggleHoverState)
  }

  toggleHoverState = state => ({ isHovering: !state.isHovering })

  showButtons() {
    const {deck, history} = this.props
    return (
      <div>
        <button onClick={() => {
          selectDeck(deck.id)
          history.push(`/decks/${deck.id}`)
        }}>View</button>
        <button onClick={() => history.push(`/decks/${deck.id}/edit`)}
        >Edit</button>
        <button onClick={() => history.push(`/decks/${deck.id}/delete`)}
        >Delete</button>
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

const mapDispatch = {selectDeck}

export default connect(mapState, mapDispatch)(DecksList_SingleDeck)
