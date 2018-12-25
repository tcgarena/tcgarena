import React from 'react'
import {connect} from 'react-redux'

const DeckPreview = ({decks, deckId}) => {

  const mainDeck = []
  const sideboard = []

  if (deckId) {
    decks[deckId].list.split('\n').forEach( (line, idx) => {
      if (line.slice(0,3) === 'SB:') {
        sideboard.push(<p key={idx}>{line}</p>)
      } else {
        mainDeck.push(<p key={idx}>{line}</p>)
      }
    })
  }

  return deckId ? (
    <div className="decklist-preview-container">
      <div className="decklist-preview">
        {mainDeck}
      </div>
      <div className="decklist-preview">
        {sideboard}
      </div>
    </div>
  ) : (
    <div className="decklist-preview-container decklist-preview">
      <div></div>
    </div>
  )
}

const mapState = ({decks}) => ({decks})

export default connect(mapState)(DeckPreview)
