import React from 'react'
import {connect} from 'react-redux'

const PairingItem = ({pair, myUsername}) => {
  let me, opponent, myPairing = false
  
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

  return (
    <div>
      {me.cockatriceName} ({me.deckhash}) vs {opponent.cockatriceName} ({opponent.deckhash})
    </div>
  )
}

const mapState = ({user}) => ({
  myUsername: user.cockatriceName
})

export default connect(mapState)(PairingItem)