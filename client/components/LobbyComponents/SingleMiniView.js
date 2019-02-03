import React from 'react'
import {connect} from 'react-redux'
import {Route, Switch, withRouter} from 'react-router-dom'
import {
  MiniJudgePanel,
  JoinMiniForm,
  PairingsList,
  MatchResultForm
} from '../index'
import {getMini, leaveMini} from '../../store'

const SingleMiniView = ({isJudge, getMini, match, leaveMini, myUsername, history}) => {
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
        {isJudge && <MiniJudgePanel />}

        <div className="row">
          <p>
            {mini.format} {mini.type}{' '}
            {`${currentPlayersAmt}/${mini.maxPlayers}`}
          </p>
        </div>

        {mini.state === 'mini-over' && <div>
          {mini.participants[mini.winner].cockatriceName} wins!
        </div>}

        {mini.state === 'open' && joined && <button onClick={() => leaveMini(mini.uuid)}>
          Leave
        </button>}

        {mini.state === 'open' && !joined && <button onClick={
          () => history.push(`/lobby/${mini.uuid}/join`)
        }>
          Join
        </button>}

        <div className='column'>
        { Object.keys(mini.pairings).length ? (
            <div>
              <MatchResultForm />
              <PairingsList pairings={mini.pairings} />
            </div>
          ) : (
            participantsArr.map(user => (
              <div className="mini-participants" key={user.cockatriceName}>
                {user.cockatriceName} ({user.ELO})
              </div>
            ))
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
  leaveMini
}

export default withRouter(connect(mapState, mapDispatch)(SingleMiniView))
