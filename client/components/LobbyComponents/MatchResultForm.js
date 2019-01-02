import React from 'react'
import {connect} from 'react-redux'
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

  handleSubmit(e) {
    e.preventDefault()
    console.log(this.state)
  }

  handleChange(e) {
    e.preventDefault()
    this.setState({[e.target.name]: e.target.value})
  }

  render() {
    const {username, opponent} = this.props
    return (
      <div className='match-report-form'>
        <form className='row' onSubmit={this.handleSubmit}>
          <div className='column'>
            <p>{username}</p>
            <input type="text" name='myScore' value={this.state.myScore} onChange={this.handleChange} />
          </div>
          <div className='column'>
            <p>{opponent.cockatriceName}</p>          
            <input type="text" name='opponentScore' value={this.state.opponentScore} onChange={this.handleChange} />
          </div>
          <input type="submit" value="Report" />
        </form>
      </div>
    )
  }
}

const mapState = ({user}) => ({
  username: user.cockatriceName
})

export default connect(mapState)(MatchResultForm)