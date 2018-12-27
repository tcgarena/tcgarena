import React from 'react'
import {connect} from 'react-redux'
import {Route, Switch, withRouter} from 'react-router-dom'
import {MiniJudgePanel, JoinMiniForm} from '../index'

const SingleMiniView = ({isJudge, minis, match, history}) => {
  const id = match.params.miniId
  const mini = minis[id]
  const currentPlayersAmt = mini.participants.length 
  
  return mini ? (
    <div className="single-mini">
      <div className='row'>
        <p>{mini.format} {mini.type} {`${currentPlayersAmt}/${mini.maxPlayers}`}</p>
      </div>

      {isJudge && <MiniJudgePanel />}

      <Switch>
        <Route exact path='/lobby/:miniId/join' component={JoinMiniForm} />
      </Switch>

    </div>
  ) : (
    <div>Mini not active</div>
  )
}

const mapState = ({mini, user: {accessLevel}}) => ({
  minis: mini,
  isJudge: accessLevel > 0
})

export default withRouter(connect(mapState)(SingleMiniView))
