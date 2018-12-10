import React from 'react'
import {connect} from 'react-redux'
import {fetchMinis} from '../../store'

class LobbyMenu extends React.Component {

  componentDidMount() {
    this.props.fetchMinis()
  }

  render() {
    return (
      <div>Lobby</div>
    )
  }
}

const mapDispatch = { fetchMinis }

export default connect(null, mapDispatch)(LobbyMenu)