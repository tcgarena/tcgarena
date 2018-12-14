import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

const LobbyJudgePanel = ({history}) => {
  return (
    <div>
      <button onClick={()=>
        history.push('/lobby/new')
      }>New Mini</button>
    </div>
  )
}

export default withRouter(
  connect()(LobbyJudgePanel)
)