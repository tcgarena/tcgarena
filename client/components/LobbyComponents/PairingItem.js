import React from 'react'
import {connect} from 'react-redux'
import {MatchResultForm} from '../index'

const PairingItem = ({pair, myUsername}) => {
  let me, opponent
  const myPairing = pair.reduce( (prev, player) => {
    if (player.cockatriceName === myUsername) {
      me = player
      return true
    } else {
      opponent = player
      return prev
    }
  }, false)
  if (!myPairing) {
    me = pair[0]
    opponent = pair[1]
  }

  return (
    <div>
      {me.cockatriceName} ({me.deckhash}) vs {opponent.cockatriceName} ({opponent.deckhash})
      {myPairing && <MatchResultForm opponent={opponent} />}
    </div>
  )
}

const mapState = ({user}) => ({
  myUsername: user.cockatriceName
})

export default connect(mapState)(PairingItem)