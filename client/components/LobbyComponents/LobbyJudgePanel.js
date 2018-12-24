import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
// import {} from '../../store'

const LobbyJudgePanel = ({history}) => {
  return (
    <div>
      <button onClick={()=>
        history.push('/lobby/new')
      }>New Mini</button>
    </div>
  )
}

const mapState = ({}) => ({})
const mapDispatch = {}

export default withRouter(
  connect(mapState, mapDispatch)(LobbyJudgePanel)
)