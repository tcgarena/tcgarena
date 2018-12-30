import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {getMini} from '../../store'

const MiniJudgePanel = ({match, getMini}) => {
  const mini = getMini(match.params.miniId)

  const showButtons = () => {
    const isFull = mini.participants.length >= mini.maxPlayers
    const isActive = mini.state === 'active'
    const isClosed = mini.state === 'closed'
    const roundOver = 'placeholder'

    const buttons = []
    // tournament is ongoing
    if (isActive) {

    } 

    // tournament has ended    
    else if (isClosed) {

    }

    // tournament is open
    else {

      if (isFull) {
        buttons.push(
          <button key='start'>
            Start
          </button>
        )
      }

      buttons.push(
        <button key='cancel'>
          Cancel
        </button>
      )
    }

    return buttons
  }


  return (
    <div className='mini-judge-panel'>
      {mini && showButtons()}
    </div>
  )
}

const mapState = state => ({
  getMini: miniId => getMini(state, miniId)
})

export default withRouter(
  connect(mapState)(MiniJudgePanel)
)