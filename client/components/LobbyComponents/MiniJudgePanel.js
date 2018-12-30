import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {getMini, startMini} from '../../store'

const MiniJudgePanel = ({match, getMini, startMini}) => {
  const mini = getMini(match.params.miniId)

  const showButtons = () => {
    const isFull = mini.participants.length >= mini.maxPlayers
    const isActive = mini.state === 'active'
    const isClosed = mini.state === 'closed'
    const roundOver = 'placeholder'

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

    // tournament has ended    
    else if (isClosed) {

    }

    // tournament is open
    else {

      if (isFull) {
        buttons.addButton('Start', () => startMini(mini.id))
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
  startMini
}

export default withRouter(
  connect(mapState, mapDispatch)(MiniJudgePanel)
)