import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import axios from 'axios'

class MiniHistory extends Component {
  constructor(props) {
    super(props)
    this.state = {
      closedMinis: []
    }
  }

  async componentDidMount() {
    try {
      const cockatriceName = this.props.match.params.cockatriceName
      const {data: closedMinis} = await axios.get(`/api/user/minis/${cockatriceName}`)
      this.setState({closedMinis})
    } catch (e) {
      console.error(e)
    }
  }

  render() {
    return (
      <div className='mini-history-container'>
        <h1>Past Minis</h1>
        <div className='mini-history-list'>
          {this.state.closedMinis.map((mini) => {
            return <div className='mini-history-item' key={mini.id}>
              <p>{mini.format} {mini.type}</p>
              <p>{(new Date(mini.createdAt)).toLocaleString()}</p>
              <button className='global-button'
                onClick={() => this.props.history.push(`/mini/${mini.uuid}`)}
              >View</button>
            </div>
          }
          )}
        </div>
      </div>
    )
  }
}

export default withRouter(MiniHistory)
