import React from 'react'
import {connect} from 'react-redux'
import {Route, Switch, withRouter} from 'react-router-dom'
import {MiniJudgePanel, JoinMiniForm} from '../index'
import {getMini} from '../../store'

const SingleMiniView = ({isJudge, getMini, match}) => {
  
  const mini = getMini(match.params.miniId)

  const showMini = () => {
    const participantsArr = Object.keys(mini.participants).map(key => mini.participants[key])
      .sort( (prev, curr) => prev.ELO > curr.ELO ? -1 : 1 )
    const currentPlayersAmt = participantsArr.length

    return (
      <div className="single-mini">

        {isJudge && <MiniJudgePanel />}
        
        <div className='row'>
          <p>{mini.format} {mini.type} {`${currentPlayersAmt}/${mini.maxPlayers}`}</p>
        </div>

        <div className='column'>
        { mini.pairings ? 
            mini.pairings.map( (pair, idx) => <div key={idx}>
              {pair[0].cockatriceName} ({pair[0].deckhash}) vs {pair[1].cockatriceName} ({pair[1].deckhash})
            </div>)
            : participantsArr.map(user => <div key={user.id}>
              {user.ELO} {user.cockatriceName}
            </div> )
        }
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
