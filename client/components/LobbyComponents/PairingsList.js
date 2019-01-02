import React from 'react'
import {PairingItem} from '../index'

const PairingsList = ({pairings}) => {
  return (
    <div className='pairings-list'>
      {pairings.map( (pair, idx) => <PairingItem pair={pair} key={idx} /> )}
    </div>
  )
}

export default PairingsList