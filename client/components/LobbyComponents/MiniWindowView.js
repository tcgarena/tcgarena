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

  showJoin() {
    const {cockatriceName, mini} = this.props
    const participants = Object.keys(mini.participants).map(
      key => mini.participants[key]
    )
    const usernames = participants.map(
      participant => participant.cockatriceName
    )

    if (participants.length === mini.maxPlayers) {
      // return this.viewButton.apply(this)
    } else if (usernames.includes(cockatriceName)) {
      // return this.viewButton.apply(this)
    } else {
      // return this.joinButton.apply(this)
      return true
    }
    return false
  }

  render() {
    const {mini} = this.props
    const participants = Object.keys(mini.participants).map(
      key => mini.participants[key]
    )
    const showJoin = this.showJoin.apply(this)
    const currentPlayersAmt = participants.length
    const viewButton = this.viewButton.apply(this)
    const joinButton = this.joinButton.apply(this)

    return (
      <div className="column mini-window-container">
        <div className="row">
          <p>
            {mini.format}
          </p>
          <p>{`${currentPlayersAmt}/${mini.maxPlayers}`} players</p>
        </div>
        <div style={{marginLeft: 4}}>
          {mini.type}
        </div>
        <div className="hosted-by">
          <p>Hosted by: {mini.judge}</p>
        </div>
        <div className="mini-window-buttons">
          <button onClick={viewButton.action}>{viewButton.text}</button>
          {showJoin && <button onClick={joinButton.action}>{joinButton.text}</button>}
        </div>
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
