import React from 'react'

const DecksList = ({ decks, selectDeck }) => {
  return (
    <div className='deck-list'>
      {
        decks.map(deck => (
          <p key={deck.id} onClick={()=>selectDeck(deck)}>{deck.name}</p>
        ))
      }
    </div>
  )
}

export default DecksList