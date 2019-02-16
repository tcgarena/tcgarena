import React from 'react'
import {connect} from 'react-redux'

const DeckPreview = ({decks, deckId}) => {

  const mainDeck = []
  const sideboard = []

  if (deckId) {
    decks[deckId].list.split('\n').forEach( (line, idx) => {
      console.log(line.slice(0,2) === '//')
      if (line.slice(0,2) !== '//') {
        if (line.slice(0,3) === 'SB:') {
          sideboard.push(<p key={idx}>{line.slice(4)}</p>)
        } else {
          mainDeck.push(<p key={idx}>{line}</p>)
        }
      }
    })
  }

  return deckId ? (
    <div className="decklist-preview-container">
      <div className="decklist-preview">
        <h5>Maindeck</h5>
        {mainDeck}
      </div>
      <div className="decklist-preview">
        <h5>Sideboard</h5>
        {sideboard}
      </div>
    </div>
  ) : (
    <div className="decklist-preview-container decklist-preview">
      <div>Hover over a deck to see a preview.</div>
    </div>
  )
}

const mapState = ({decks}) => ({decks})

export default connect(mapState)(DeckPreview)
