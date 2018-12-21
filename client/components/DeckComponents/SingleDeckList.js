import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

const SingleDeckList = ({decks, match, history}) => {
  const id = match.params.deckId
  const deck = decks[id]
  return deck ? (
    <div className="single-decklist">
      <h4>{deck.name}</h4>
      <button onClick={()=>history.push(`/decks/${id}/edit`)}>
        Edit
      </button>
      <button onClick={()=>history.push(`/decks/${id}/delete`)}>
        Delete
      </button>
      <h5>{deck.format}</h5>
      <div className="decklist-text">
        {deck.list.split('\n').map((line, idx) => <p key={idx}>{line}</p>)}
      </div>
    </div>
  ) : (
    <div>This deck doesn't belong to you...</div>
  )
}

const mapState = ({decks}) => ({decks})

export default withRouter(
  connect(mapState)(SingleDeckList)
)
