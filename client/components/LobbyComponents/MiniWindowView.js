import React from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {joinMini, selectFormat} from '../../store'

class MiniWindowView extends React.Component {
  viewButton = () => ({
    text: 'view',
    action: () => this.props.history.push(`/lobby/${this.props.mini.uuid}`)
  })

  joinButton = () => ({
    text: 'join',
    action: this.join.bind(this)
  })

  async join() {
    const {history, mini, selectFormat} = this.props
    selectFormat(mini.format)
    history.push(`/lobby/${mini.uuid}/join`)
  }

  chooseAction() {
    const {cockatriceName, mini} = this.props
    const participants = Object.keys(mini.participants).map(
      key => mini.participants[key]
    )
    const usernames = participants.map(
      participant => participant.cockatriceName
    )
    if (participants.length === mini.maxPlayers) {
      return this.viewButton.apply(this)
    } else if (usernames.includes(cockatriceName)) {
      return this.viewButton.apply(this)
    } else {
      return this.joinButton.apply(this)
    }
  }

  render() {
    const {mini} = this.props
    const participants = Object.keys(mini.participants).map(
      key => mini.participants[key]
    )
    const actionButton = this.chooseAction.apply(this)
    const currentPlayersAmt = participants.length
    console.log(mini)
    return (
      <div className="column mini-window-container">
        <div className="row">
          <p>
            {mini.format} {mini.type}
          </p>
          <p>{`${currentPlayersAmt}/${mini.maxPlayers}`} players</p>
        </div>
        <div className="hosted-by">
          <p>Hosted by: {mini.judge}</p>
        </div>
        <button onClick={actionButton.action}>{actionButton.text}</button>
      </div>
    )
  }
}

const mapState = ({user: {cockatriceName}}) => ({
  cockatriceName
})

const mapDispatchToProps = {
  joinMini,
  selectFormat
}

export default withRouter(connect(mapState, mapDispatchToProps)(MiniWindowView))
