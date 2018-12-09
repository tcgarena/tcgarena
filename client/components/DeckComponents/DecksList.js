import React from 'react'

const DecksList = ({ decks, selectDeck }) => {
  const decksArr = Object.keys(decks).map(key=>decks[key])
  return (
    <div className='deck-list'>
      {
        decksArr.map(deck => (
          <p key={deck.id} onClick={()=>selectDeck(deck)}>{deck.name}</p>
        ))
      }
    </div>
  )
}

export default DecksList