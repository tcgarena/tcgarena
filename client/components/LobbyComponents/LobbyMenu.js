import React from 'react'
import {connect} from 'react-redux'
import {Route, Switch, withRouter} from 'react-router-dom'
import {fetchMinis} from '../../store'
import {SingleMiniView, MiniList, LobbyJudgePanel, JoinMiniForm} from '../index'

class LobbyMenu extends React.Component {

  componentDidMount() {
    this.props.fetchMinis()
  }

  render() {
    const {pathname} = this.props.history.location
    return (
      <div id='lobby-main'>
        {(this.props.isJudge && pathname==='/lobby')
          && <LobbyJudgePanel/>
        }
        <Switch>
          <Route exact path='/lobby' component={MiniList} />
          <Route exact path='/lobby/:miniId' component={SingleMiniView} />
          <Route exact path='/lobby/:miniId/join' component={JoinMiniForm} />
        </Switch>
      </div>
    )
  }
}

const mapState = state => ({
  isJudge: state.user.accessLevel > 0
})

const mapDispatch = { fetchMinis }

export default withRouter(
  connect(mapState, mapDispatch)(LobbyMenu)
)
