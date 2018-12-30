import React from 'react'
import {connect} from 'react-redux'
import {Route, Switch, withRouter} from 'react-router-dom'
import {MiniJudgePanel, JoinMiniForm} from '../index'
import {getMini} from '../../store'

const SingleMiniView = ({isJudge, getMini, match}) => {
  
  const mini = getMini(match.params.miniId)

  const showMini = () => {

    const currentPlayersAmt = mini.participants.length || 0

    return (
      <div className="single-mini">

        {isJudge && <MiniJudgePanel />}
        
        <div className='row'>
          <p>{mini.format} {mini.type} {`${currentPlayersAmt}/${mini.maxPlayers}`}</p>
        </div>
  
        <Switch>
          <Route exact path='/lobby/:miniId/join' component={JoinMiniForm} />
        </Switch>
  
      </div>
    )
  }  

  return (
    <div>
      {mini && showMini(mini)}
    </div>
  )
}

const mapState = state => ({
  getMini: miniId => getMini(state, miniId),
  isJudge: state.user.accessLevel > 0
})

export default withRouter(connect(mapState)(SingleMiniView))
