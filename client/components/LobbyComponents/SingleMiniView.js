import React from 'react'
import {connect} from 'react-redux'
import {Route, Switch, withRouter} from 'react-router-dom'
import {
  MiniJudgePanel,
  JoinMiniForm,
  PairingsList,
  MatchResultForm
} from '../index'
import {getMini} from '../../store'

const SingleMiniView = ({isJudge, getMini, match}) => {
  const mini = getMini(match.params.miniId)

  const showMini = () => {
    const participantsArr = Object.keys(mini.participants)
      .map(key => mini.participants[key])
      .sort((prev, curr) => (prev.ELO > curr.ELO ? -1 : 1))
    const currentPlayersAmt = participantsArr.length
    console.log('parcipantsArr', participantsArr)

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

        { Object.keys(mini.pairings).length ? <div>
          <div className='column'>
            <MatchResultForm />
            <PairingsList pairings={mini.pairings} />
            </div>
          ) : (
            participantsArr.map(user => (
              <div className="mini-participants" key={user.cockatriceName}>
              Cockatrice Name: {user.cockatriceName} <br />
                ELO: {user.ELO}
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

export default withRouter(connect(mapState)(SingleMiniView))
