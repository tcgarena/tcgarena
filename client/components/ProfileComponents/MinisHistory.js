import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import axios from 'axios'

class MinisHistory extends Component {
  constructor(props) {
    super(props)
    this.state = {
      closedMinis: []
    }
  }

  async componentDidMount() {
    try {
      const {data: closedMinis} = await axios.get(`/api/user/minis/${this.props.name}`)
      this.setState({closedMinis})
    } catch (e) {
      console.error(e)
    }
  }

  render() {
    console.log(this.state.closedMinis)
    return (
      <div>
        <div>
          <h1>Past Minis</h1>
        </div>
        <div>
          {this.state.closedMinis.map((mini) =>
            <div key={mini.id}>
              <p>Date created: {mini.createdAt}</p>
              <p>Players: {mini.maxPlayers}</p>
              <p>Time per round: {mini.timePerRoundMins} minutes</p>
              <p>Type: {mini.type}</p>
              <p>Date ended: {mini.updatedAt}</p>
              </div>
          )}
        </div>
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => ({
  // name: state.user.user.cockatriceName
  name: state.user.cockatriceName
})

export default connect(mapState)(MinisHistory)
