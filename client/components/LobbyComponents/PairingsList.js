import React from 'react'
import {connect} from 'react-redux'
import {PairingItem} from '../index'
import {getMyMatch} from '../../store'

const PairingsList = ({pairings, getMyMatch}) => {
  // const myMatch = getMyMatch(miniUuid)

  return (
    <div className='pairings-list'>
      {Object.keys(pairings).map( (pair, idx) => <PairingItem pair={pairings[pair]} key={idx} /> )}
    </div>
  )
}

const mapState = state => ({
  getMyMatch: miniUuid => getMyMatch(state, miniUuid)
})

export default connect(mapState)(PairingsList)