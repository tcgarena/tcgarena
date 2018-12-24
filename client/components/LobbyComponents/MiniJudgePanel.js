import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
// import {} from '../../store'

const MiniJudgePanel = ({history}) => {
  return (
    <div>
      mini judge panel
    </div>
  )
}

const mapState = ({}) => ({})
const mapDispatch = {}

export default withRouter(
  connect(mapState, mapDispatch)(MiniJudgePanel)
)