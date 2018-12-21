import React from 'react'
import {connect} from 'react-redux'
import {selectDeck} from '../../store'

class DecksList_SingleDeck extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isHovering: false,
      quickView: false
    }
  }

  handleMouseHover = () => {
    this.setState(this.toggleHoverState)
  }

  handleClick = () => {
    this.setState(this.toggleQuickView)
  }

  toggleQuickView(state) {
    return {
      quickView: !state.quickView
    }
  }

  toggleHoverState(state) {
    return {
      isHovering: !state.isHovering
    }
  }

  showButtons() {
    const {deck, history} = this.props
    return (
      <div>
        <button
          type="button"
          onClick={() => {
            selectDeck(deck.id)
            history.push(`/decks/${deck.id}`)
          }}
        >
          View
        </button>
        <button
          type="button"
          onClick={() => history.push(`/decks/${deck.id}/edit`)}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => history.push(`/decks/${deck.id}/delete`)}
        >
          Delete
        </button>
      </div>
    )
  }

  render() {
    const {deck} = this.props
    console.log(this.state)
    return (
      <div
        className="single-deck-list"
        onMouseEnter={this.handleMouseHover}
        onMouseLeave={this.handleMouseHover}
      >
        <p onClick={this.handleClick}>{deck.name}</p>
        {this.state.isHovering && this.showButtons()}
        {this.state.quickView && (
          <div className="decklist-text">
            {deck.list.split('\n').map((line, idx) => <p key={idx}>{line}</p>)}
          </div>
        )}
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
