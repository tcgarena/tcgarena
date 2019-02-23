import React from 'react'
import {connect} from 'react-redux'
import {Route, Switch, withRouter} from 'react-router-dom'
import {
  MiniJudgePanel,
  JoinMiniForm,
  PairingsList,
  MatchResultForm
} from '../index'
import {getMini, leaveMini, selectFormat} from '../../store'

const SingleMiniView = ({isJudge, getMini, match, leaveMini, myUsername, history, selectFormat}) => {
  const mini = getMini(match.params.miniId)

  const showMini = () => {
    let joined = false
    const participantsArr = Object.keys(mini.participants)
      .map(key => {
        if (mini.participants[key].cockatriceName === myUsername)
          joined = true
        return mini.participants[key]
      })
      .sort((prev, curr) => (prev.ELO > curr.ELO ? -1 : 1))
    const currentPlayersAmt = participantsArr.length

    return (
      <div className="single-mini">

        <div className="row">
          <p className='single-mini-title'>
            {mini.format} {mini.type}{' '}
            {`${currentPlayersAmt}/${mini.maxPlayers}`}
          </p>
        </div>
        
        {isJudge && <MiniJudgePanel />}

        {mini.state === 'mini-over' && <div className='mini-winner'>
          {mini.participants[mini.winner].cockatriceName} wins!
        </div>}

        {mini.state === 'open' && joined && <button 
          className='global-button'
          onClick={() => leaveMini(mini.uuid)}
        >
          Leave
        </button>}

        {mini.state === 'open' && !joined && currentPlayersAmt !== mini.maxPlayers && <button 
          onClick={
            () => history.push(`/lobby/${mini.uuid}/join`)
          }
          className='global-button'
        >
          Join
        </button>}

        <div>
        { Object.keys(mini.pairings).length ? (
            <div>
              <MatchResultForm />
              <PairingsList pairings={mini.pairings} miniUuid={mini.uuid} />
            </div>
          ) : (
            <div className='single-mini-participants-container'>
              <u>Participants</u>
                {participantsArr.map(user => (
                  <div className="single-mini-participants" key={user.cockatriceName}>
                    {user.cockatriceName} ({user.ELO})
                  </div>
                ))}
            </div>
          )}
        </div>

        <Switch>
          <Route exact path="/lobby/:miniId/join" component={JoinMiniForm} />
        </Switch>
      </div>
    )
  }

  return <div>{mini && showMini(mini)}</div>
}

const mapState = state => ({
  getMini: miniId => getMini(state, miniId),
  isJudge: state.user.accessLevel > 0,
  myUsername: state.user.cockatriceName
})

const mapDispatch = {
  leaveMini, selectFormat
}

export default withRouter(connect(mapState, mapDispatch)(SingleMiniView))
