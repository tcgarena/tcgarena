import React from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import {getMini} from '../../store'

const PairingItem = ({pair, myUsername, isJudge, miniUuid, matchUuid, getMini, history}) => {
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
      <div className='row'>
        <div className='pointer' onClick={()=>history.push(`/user/${me.cockatriceName}`)}>
          {me.cockatriceName} ({me.deckhash})
        </div>
        <div style={{marginLeft: 4, marginRight: 4}}>vs.</div>
        <div className='pointer' onClick={()=>history.push(`/user/${opponent.cockatriceName}`)}>
          {opponent.cockatriceName} ({opponent.deckhash})
        </div>
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

export default withRouter(connect(mapState)(PairingItem))