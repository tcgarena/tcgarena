import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {getMini, startMini, nextRound} from '../../store'
import {JudgeResultForm} from '..'

const MiniJudgePanel = ({match, getMini, startMini, nextRound}) => {
  const mini = getMini(match.params.miniId)

  const showButtons = () => {
    const isFull = Object.keys(mini.participants).length >= mini.maxPlayers
    const isActive = mini.state === 'active'
    const isClosed = mini.state === 'closed'
    const roundOver = mini.state === 'round-over'
    const isOverButActive = mini.state === 'mini-over'

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

    else if (isOverButActive) {
      buttons.addButton('Close')
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

  const showResultForms = () => {

    const lockedResults = Object.keys(mini.results).reduce( (results, key) => {
      const result = mini.results[key]
      const match = mini.pairings[key]
      if (result.locked) {
        results.push(<JudgeResultForm key={match.uuid}
          miniUuid={mini.uuid}
          matchUuid={key}
          player1={match[0]}
          player2={match[1]}
        />)
      }
      return results
    }, [])

    return lockedResults
  }

  return (
    <div className='mini-judge-panel'>
      {mini && showButtons()}
      {mini && showResultForms()}
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