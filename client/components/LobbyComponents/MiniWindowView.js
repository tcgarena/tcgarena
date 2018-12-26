import React from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux';
import {joinMini, selectFormat} from '../../store'

class MiniWindowView extends React.Component {

  viewButton = () => ({
    text: 'view',
    action: () => this.props.history.push(`/lobby/${this.props.mini.id}`)
  })

  joinButton = () => ({
    text: 'join',
    action: this.join.bind(this)
  })

  async join() {
    const {history, mini, selectFormat} = this.props
    selectFormat(mini.format)
    history.push(`/lobby/${mini.id}/join`)
  }

  chooseAction() {
    const {userId, mini} = this.props 
    mini.participants = [0,1]
    if (mini.participants.length === mini.maxPlayers) {
      return this.viewButton.apply(this)
    } else if (mini.participants.includes(userId)) {
      return this.viewButton.apply(this)
    } else {
      return this.joinButton.apply(this)
    }
  }

  render() {
    const {mini} = this.props
    const actionButton = this.chooseAction.apply(this)
    const currentPlayersAmt = mini.participants.length
    return (
      <div className='column mini-window-container'>
        <div className='row'>
          <p>{mini.format} {mini.type}</p>
          <p>{`${currentPlayersAmt}/${mini.maxPlayers}`}</p>
        </div>

        <button onClick={actionButton.action} >
          {actionButton.text}
        </button>
      </div>
    )
  }
}

const mapState = ({user: {id}}) => ({
  userId: id
})

const mapDispatchToProps = {
  joinMini, selectFormat
}

export default withRouter(
  connect(mapState, mapDispatchToProps)(MiniWindowView)
)