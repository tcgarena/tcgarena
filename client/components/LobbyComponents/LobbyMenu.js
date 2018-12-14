import React from 'react'
import {connect} from 'react-redux'
import {Route, Switch, withRouter} from 'react-router-dom'
import {fetchMinis} from '../../store'
import { NewMiniForm, MiniList, LobbyJudgePanel } from '../index'

class LobbyMenu extends React.Component {

  componentDidMount() {
    this.props.fetchMinis()
  }

  render() {
    const {pathname} = this.props.history.location
    return (
      <div>
        {(this.props.isJudge && pathname==='/lobby')
          && <LobbyJudgePanel/>
        }
        <Switch>
          <Route exact path='/lobby' component={MiniList} />
          <Route exact path='/lobby/new' component={NewMiniForm} />
        </Switch>
      </div>
    )
  }
}

const mapState = ({user: {accessLevel}}) => ({
  isJudge: accessLevel > 0
})

const mapDispatch = { fetchMinis }

export default withRouter(
  connect(mapState, mapDispatch)(LobbyMenu)
)