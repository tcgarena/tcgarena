import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {getMini, startMini, nextRound} from '../../store'

const MiniJudgePanel = ({match, getMini, startMini}) => {
  const mini = getMini(match.params.miniId)

  const showButtons = () => {
    const isFull = Object.keys(mini.participants).length >= mini.maxPlayers
    const isActive = mini.state === 'active'
    const isClosed = mini.state === 'closed'
    const roundOver = mini.state === 'round-over'

    const buttons = []
    Object.defineProperty(buttons, 'addButton', {
      value: (text, fn=()=>console.log(text)) => {buttons.push(
        <button type='button' key={text} onClick={fn}>
          {text}
        </button>
      )},
      writable: false
    })

    // tournament is ongoing
    if (isActive) {

    } 

    // tournament is ongoing, but round is over
    else if (roundOver) {
      buttons.addButton('Next round', () => nextRound(mini.uuid))
    }

    // tournament has ended    
    else if (isClosed) {

    }

    // tournament is open
    else {

      if (isFull) {
        buttons.addButton('Start', () => startMini(mini.uuid))
      }

      buttons.addButton('Cancel')
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

const mapDispatch = {
  startMini, nextRound
}

export default withRouter(
  connect(mapState, mapDispatch)(MiniJudgePanel)
)