import React from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux';
import {joinMini} from '../../store'

class MiniWindowView extends React.Component {
  constructor(props) {
    super(props)
    this.join = this.join.bind(this)
  }

  async join() {
    await this.props.joinMini(this.props.mini.id)
    // this.props.history.push(`/lobby/mini/${mini.id}`)
  }

  render() {
    const { mini } = this.props
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
  joinMini
}

export default withRouter(
  connect(null, mapDispatchToProps)(MiniWindowView)
)