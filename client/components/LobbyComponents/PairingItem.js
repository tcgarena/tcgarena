import React from 'react'
import {connect} from 'react-redux'
import {MatchResultForm} from '../index'

const PairingItem = ({pair, myUsername}) => {
  let opponent
  console.log(pair)
  const myPairing = pair.reduce( (prev, player) => {
    if (player.cockatriceName === myUsername) {
      return true
    } else {
      opponent = player
      return prev
    }
  }, false)

  return (
    <div>
      {pair[0].cockatriceName} ({pair[0].deckhash}) vs {pair[1].cockatriceName} ({pair[1].deckhash})
      {myPairing && <MatchResultForm opponent={opponent} />}
    </div>
  )
}

const mapState = ({user}) => ({
  myUsername: user.cockatriceName
})

export default connect(mapState)(PairingItem)