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
    this.setState({[e.target.name]: parseInt(e.target.value)})
  }

  render() {
    const {player1, player2} = this.props
    return (
      <div className='match-report-form'>
        <form className='row' onSubmit={this.handleSubmit}>
          <div className='column'>
            <p>{player1.cockatriceName}</p>
            <input type="number" min='0' max='2' name='score1' value={this.state.score2} onChange={this.handleChange} />
          </div>
          <div className='column'>
            <p>{player2.cockatriceName}</p>          
            <input type="number" min='0' max='2' name='score2' value={this.state.score2} onChange={this.handleChange} />
          </div>
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

export default JudgeResultForm