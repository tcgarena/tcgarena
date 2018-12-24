import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {MiniJudgePanel} from '../index'

const SingleDeckView = ({isJudge, minis, match, history}) => {
  const id = match.params.miniId
  const mini = minis[id]
  const currentPlayersAmt = mini.participants.length
  return mini ? (
    <div className="single-mini">
      {isJudge && <MiniJudgePanel />}
      <div className='row'>
        <p>{mini.format} {mini.type} {`${currentPlayersAmt}/${mini.maxPlayers}`}</p>
      </div>
    </div>
  ) : (
    <div>Mini not active</div>
  )
}

const mapState = ({mini, user: {accessLevel}}) => ({
  minis: mini,
  isJudge: accessLevel > 0
})

export default withRouter(connect(mapState)(SingleDeckView))
