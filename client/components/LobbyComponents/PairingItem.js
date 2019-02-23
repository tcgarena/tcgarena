import React from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import {getMini} from '../../store'

const PairingItem = ({pair, myUsername, isJudge, miniUuid, matchUuid, getMini}) => {
  let me, opponent, myPairing = false
  const mini = getMini(miniUuid)
  
  for (let i=0; i<2; i++) {
    if (pair[i].cockatriceName === myUsername) {
      me = pair[i]
      myPairing = true
    } else {
      opponent = pair[i]
    }
  }

  if (!myPairing) {
    me = pair[0]
    opponent = pair[1]
  }

  const result = mini.results[matchUuid]
  let locked = false
  let finalized = false
  if (result) {
    locked = mini.results[matchUuid].locked
    finalized = mini.results[matchUuid].finalized
  }

  return (
    <div className={isJudge ? 'pairing-item-judge':'pairing-item'}>
      <div>
        {me.cockatriceName} ({me.deckhash}) vs {opponent.cockatriceName} ({opponent.deckhash})
      </div>
      {isJudge && !locked && !finalized && <button 
        className='lock-button'
        onClick={() => axios.put('/api/match/result/lock', {
          miniUuid, matchUuid
        })}
      >
        Lock
      </button>}
      {isJudge && locked && !finalized && <div className='text-bubble'>
        Locked
      </div>}
    </div>
  )
}

const mapState = state => ({
  myUsername: state.user.cockatriceName,
  isJudge: state.user.accessLevel > 0,
  getMini: miniId => getMini(state, miniId)
})

export default connect(mapState)(PairingItem)