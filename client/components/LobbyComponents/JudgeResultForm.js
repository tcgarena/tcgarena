import React from 'react'
import axios from 'axios'

class JudgeResultForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      score1: 0,
      score2: 0,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()
    const {miniUuid, matchUuid, player1, player2} = this.props
    axios.post(`/api/match/result/judge`, {
      miniUuid, matchUuid, 
      uuid1: player1.uuid,
      uuid2: player2.uuid,
      ...this.state
    })
  }

  handleChange(e) {
    e.preventDefault()
    const {name, value} = e.target
    const {score1, score2} = this.state
    if (score1 + score2 === 3 && value === '2') {
      name === 'score1'
        ? this.setState({score2: 1, score1: 2})
        : this.setState({score2: 2, score1: 1})
    } else {
      this.setState({[name]: parseInt(value)})
    }
  }

  render() {
    const {player1, player2} = this.props
    const {score1, score2} = this.state
    const allowSubmit = score1 === 0 && score2 === 0
    return (
      <div style={{marginTop: 20, marginBottom: 20}}>
        <form className='match-report-form' onSubmit={this.handleSubmit}>
          <div style={{fontSize: 16}}>
            Consult the players to resolve this match result
          </div>
          <div className='match-report-form-users'>
            <div className='match-report-form-user'>
              <p>{player1.cockatriceName}</p>
              <input type="number" min='0' max='2' name='score1' value={this.state.score1} onChange={this.handleChange} />
            </div>
            <div style={{margin: 30}}>vs.</div>
            <div className='match-report-form-user'>
              <p>{player2.cockatriceName}</p>          
              <input type="number" min='0' max='2' name='score2' value={this.state.score2} onChange={this.handleChange} />
            </div>
          </div>
          <input disabled={allowSubmit} className='global-button' type="submit" value="Resolve" />
        </form>
      </div>
    )
  }
}

export default JudgeResultForm