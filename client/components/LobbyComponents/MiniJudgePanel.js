import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {getMini, startMini, nextRound, closeMini} from '../../store'
import {JudgeResultForm} from '..'

const MiniJudgePanel = ({match, getMini, startMini, nextRound, closeMini}) => {
  const mini = getMini(match.params.miniId)

  const copyPairings = () => {
    const el = document.createElement('textarea');
    el.value = Object.keys(mini.pairings).reduce( (str, key) => {
      const pair = mini.pairings[key]
      if (str === '') {
        str = `${pair[0].cockatriceName} vs. ${pair[1].cockatriceName}`
      } else {
        str += ` | ${pair[0].cockatriceName} vs. ${pair[1].cockatriceName}`
      }
      return str
    }, '');
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  const showButtons = () => {
    const isFull = Object.keys(mini.participants).length >= mini.maxPlayers
    const isActive = mini.state === 'active'
    const isClosed = mini.state === 'closed'
    const roundOver = mini.state === 'round-over'
    const isOverButActive = mini.state === 'mini-over'

    const buttons = []
    Object.defineProperty(buttons, 'addButton', {
      value: (text, fn=()=>console.log(text)) => {buttons.push(
        <button 
          className='global-button'
          type='button' key={text} onClick={fn}
        >
          {text}
        </button>
      )},
      writable: false
    })

    // tournament is ongoing
    if (isActive) {
      buttons.addButton('Copy pairings', copyPairings)
    } 

    // tournament is ongoing, but round is over
    else if (roundOver) {
      buttons.addButton('Next round', () => nextRound(mini.uuid))
    }

    // tournament has ended    
    else if (isClosed) {

    }

    else if (isOverButActive) {
      buttons.addButton('Close', () => closeMini(mini.uuid))
    }

    // tournament is open
    else {

      if (isFull) {
        buttons.addButton('Start', () => startMini(mini.uuid))
      }

      buttons.addButton('Cancel', () => closeMini(mini.uuid))
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
  startMini, nextRound, closeMini
}

export default withRouter(
  connect(mapState, mapDispatch)(MiniJudgePanel)
)