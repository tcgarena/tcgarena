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
      opponentScore: 0
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
      console.log('result response',response)
    } catch(e) {
      console.error(e)
    }
  }

  handleChange(e) {
    e.preventDefault()
    this.setState({[e.target.name]: parseInt(e.target.value)})
  }

  render() {
    const {username, getMyMatch, match} = this.props
    const miniUuid = match.params.miniId
    const myMatch = getMyMatch(miniUuid)

    return (
      <div className='match-report-form'>
        <form className='row' onSubmit={e => this.handleSubmit(e, miniUuid, myMatch.uuid)}>
          <div className='column'>
            <p>{username}</p>
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

const mapState = state => ({
  username: state.user.cockatriceName,
  getMyMatch: miniUuid => getMyMatch(state, miniUuid)
})

export default withRouter(connect(mapState)(MatchResultForm))