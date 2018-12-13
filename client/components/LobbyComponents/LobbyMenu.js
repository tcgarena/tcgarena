import React from 'react'
import {connect} from 'react-redux'
import {Route, Switch, withRouter} from 'react-router-dom'
import {fetchMinis} from '../../store'
import { NewMiniForm } from '../index'

class LobbyMenu extends React.Component {

  componentDidMount() {
    this.props.fetchMinis()
  }

  render() {
    return (
      <div>
        <div>Lobby</div>
        <Switch>
          <Route exact path='/lobby/new' component={NewMiniForm} />
        </Switch>
      </div>
    )
  }
}

const mapDispatch = { fetchMinis }

export default connect(null, mapDispatch)(LobbyMenu)