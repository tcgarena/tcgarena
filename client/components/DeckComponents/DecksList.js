import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {selectDeck} from '../../store'

const DecksList = ({decks, selectedFormat, selectDeck, history}) => {
  const decksArr = Object.keys(decks)
    // reduce = keyed obj => array filtered by selected format
    .reduce( (arr, key) => {
      if (decks[key].format === selectedFormat)
        arr.push( decks[key] )
      return arr
    }, [])

  return (
    <div className='deck-list'>
      { decksArr.map(deck => 
          <p key={deck.id} 
            onClick={ () => {
              selectDeck(deck.id)
              history.push(`/decks/${deck.id}`) 
            }}
          >{deck.name}</p>
      ) }
    </div>
  )
}

const mapState = ({ decks, user: {selectedFormat} })=>({
  decks, selectedFormat
})

const mapDispatch = { selectDeck }

export default withRouter(
  connect(mapState, mapDispatch)(DecksList)
)