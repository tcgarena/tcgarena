import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {selectDeck} from '../../store'
import DecksList_SingleDeck from './DecksList_SingleDeck'

const DecksList = ({decks, selectedFormat, selectDeck, history}) => {
  const decksArr = Object.keys(decks)
    // reduce = keyed obj => array filtered by selected format
    .reduce((arr, key) => {
      if (decks[key].format === selectedFormat) arr.push(decks[key])
      return arr
    }, [])

  return (
    <div className="deck-list">
      {decksArr.map(deck => (
        <div key={deck.id}>
          <DecksList_SingleDeck
            history={history}
            deck={deck}
          />
        </div>
      ))}
    </div>
  )
}

const mapState = ({decks, user: {selectedFormat}}) => ({
  decks,
  selectedFormat
})

const mapDispatch = {selectDeck}

export default withRouter(connect(mapState, mapDispatch)(DecksList))
