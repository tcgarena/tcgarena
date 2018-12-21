import React from 'react'
import {connect} from 'react-redux'

const DeckPreview = ({decks, deckId}) => (
  <div className="decklist-text">
    {decks[deckId].list.split('\n').map((line, idx) => <p key={idx}>{line}</p>)}
  </div>
)

const mapState = ({decks}) => ({decks})

export default connect(mapState)(DeckPreview)