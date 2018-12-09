import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

const DecksList = ({decks, selectedFormat, history}) => {
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
            onClick={ () => history.push(`/decks/${deck.id}`) }
          >{deck.name}</p>
      ) }
    </div>
  )
}

const mapState = ({ decks, user: {selectedFormat} })=>({
  decks, selectedFormat
})

export default withRouter(
  connect(mapState)(DecksList)
)