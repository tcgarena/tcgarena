import React from 'react'

const SingleDeckList = ({deck}) => {
  return (
    <div className='single-decklist'>
      <h4>{deck.name}</h4>
      <div className='decklist-text'>
      {deck.list.split('\n')
        .map( (line, idx) => (
          <p key={idx}>{line}</p>
        ))
      }
      </div>
    </div>
  )
}

export default SingleDeckList