import React from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux';
import {joinMini, selectFormat} from '../../store'

class MiniWindowView extends React.Component {
  constructor(props) {
    super(props)
    this.join = this.join.bind(this)
  }

  async join() {
    const {history, mini, selectFormat} = this.props
    selectFormat(mini.format)
    history.push(`/lobby/${mini.id}/join`)
  }

  render() {
    const {mini} = this.props
    const currentPlayersAmt = mini.participants.length

    return (
      <div className='column mini-window-container'>
        <div className='row'>
          <p>{mini.format} {mini.type}</p>
          <p>{`${currentPlayersAmt}/${mini.maxPlayers}`}</p>
        </div>
        <button onClick={this.join} >
          join
        </button>
      </div>
    )
  }
}

const mapDispatchToProps = {
  joinMini, selectFormat
}

export default withRouter(
  connect(null, mapDispatchToProps)(MiniWindowView)
)