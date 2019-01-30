import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {getMyMatch} from '../../store'
import axios from 'axios'

class MatchResultForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      myScore: 0,
      opponentScore: 0,
      response: null,
      myMatch: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(e, miniUuid, matchUuid) {
    e.preventDefault()
    try {
      const {data: response} = await axios.post(`/api/match/result`, {
        ...this.state,
        miniUuid,
        matchUuid
      })
      this.setState({response: response.message})
    } catch(e) {
      console.error(e)
    }
  }

  handleChange(e) {
    e.preventDefault()
    this.setState({[e.target.name]: parseInt(e.target.value)})
  }

  componentDidMount() {
    const myMatch = this.props.getMyMatch(this.props.match.params.miniId) 
    this.setState({myMatch})
  }

  componentDidUpdate() {
    const myMatch = this.props.getMyMatch(this.props.match.params.miniId) 
    if (myMatch.opponent.cockatriceName !== this.state.myMatch.opponent.cockatriceName)
      this.setState({myMatch})
  }

  showForm() {
    const {myUsername, match, minis} = this.props
    const {response, myMatch} = this.state
    const miniUuid = match.params.miniId

    let myResult = null
    if (myMatch) myResult = minis[miniUuid].results[myMatch.uuid]

    if (myResult) {
      const myScore = myResult.reportedBy === myUsername
        ? myResult.score1 : myResult.score2
      const opponentScore = myResult.reportedBy === myUsername
        ? myResult.score2 : myResult.score1

      const gameStatus = myScore === opponentScore
        ? 'tied' : myScore > opponentScore
          ? 'won' : 'lost'

      if (myResult.finalized) {
        return <div>You {gameStatus} {myScore}-{opponentScore}</div>
      }
  
      if (myResult.reportedBy === myUsername) {
        return (
          <div>
            <p>You reported {myScore}-{opponentScore}</p>
            <button onClick={() => axios.put('/api/match/result/undo', {
              miniUuid, matchUuid: myMatch.uuid
            })}>
              Undo
            </button>
          </div>
        )
      } else {
        return (
          <div>
            <p>Your opponent said you {gameStatus} {myScore}-{opponentScore}</p>
            <button onClick={() => axios.post(`/api/match/result`, {
              myScore, opponentScore, miniUuid,
              matchUuid: myMatch.uuid
            })}>
              Confirm
            </button>
            <button onClick={() => axios.post(`/api/match/result/deny`, {
              miniUuid,
              matchUuid: myMatch.uuid
            })}>Deny</button>
          </div>
        )
        
      }

    }

    switch (response) {

      case 'score invalid':
        return (
          <div>score invalid</div>
        )

      case 'score mismatch':
        return (
          <div>score mismatch</div>
        )

      case 'internal server error':
        return (
          <div>internal server error</div>
        )

      default:
        return (
          <div className='match-report-form'>
            <form className='row' onSubmit={e => this.handleSubmit(e, miniUuid, myMatch.uuid)}>
              <div className='column'>
                <p>{myUsername}</p>
                <input type="number" min='0' max='2' name='myScore' value={this.state.myScore} onChange={this.handleChange} />
              </div>
              <div className='column'>
                <p>{myMatch.opponent.cockatriceName}</p>          
                <input type="number" min='0' max='2' name='opponentScore' value={this.state.opponentScore} onChange={this.handleChange} />
              </div>
              <input type="submit" value="Submit" />
            </form>
          </div>
        )
    }

  }

  render() {

    return <div>
      {this.state.myMatch && this.showForm()}
    </div>

  }
}

const mapState = state => ({
  myUsername: state.user.cockatriceName,
  getMyMatch: miniUuid => getMyMatch(state, miniUuid),
  minis: state.mini
})

export default withRouter(connect(mapState)(MatchResultForm))