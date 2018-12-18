import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

const SingleDeckList = ({decks, match}) => {
  const id = match.params.id
  const deck = decks[id]
  return deck ? (
    <div className="single-decklist">
      <h4>{deck.name}</h4>
      <Link to={`${deck.id}/edit`}>
        <button
          type="submit"
          // onClick={this.handleSubmit}
          // disabled={!isEnabled}
          // className={!isEnabled ? 'disabled' : 'enabled'}
        >
          Edit Deck
        </button>
      </Link>


      <h6>{deck.format}</h6>
      <div className="decklist-text">
        {deck.list.split('\n').map((line, idx) => <p key={idx}>{line}</p>)}
      </div>
    </div>
  ) : (
    <div>This deck doesn't belong to you...</div>
  )
}

const mapState = ({decks}) => ({decks})

export default connect(mapState)(SingleDeckList)
