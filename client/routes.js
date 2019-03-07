import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Login,
  Signup,
  SetCockatriceName,
  DecksMenu,
  LobbyMenu,
  HomePage,
  EditUserRoles,
  AdminTools,
  UserPage,
  ProfileAnchor,
  ClosedMiniView
} from './components'
import {me, fetchDecks} from './store'

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn, hasCockaName, isAdmin} = this.props
    return (
      <div>
        {hasCockaName && <ProfileAnchor />}
        <Switch>
          {/* Routes placed here are available to all visitors */}
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route exact path="/" component={HomePage} />
          {isLoggedIn && (
            <Switch>
              {/* Routes placed here are only available after logging in */}
              <Route path="/cockaName" component={SetCockatriceName} />
              <Route path="/decks" component={DecksMenu} />
              <Route path="/mini/:miniUuid" component={ClosedMiniView} />
              <Route exact path="/user/:cockatriceName" component={UserPage} />
              {hasCockaName && (
                <Switch>
                  {/* Routes placed here are only available after setting username */}
                  <Route path="/lobby" component={LobbyMenu} />
                  {isAdmin && (
                    <Switch>
                      {/* Routes placed here are only available to admins */}
                      {/* <Route path="/admin/minis" component={EditActiveMinis} /> */}
                      <Route path="/admin/user-roles" component={EditUserRoles} />
                      <Route exact path="/admin" component={AdminTools} />
                    </Switch>
                  )}
                </Switch>
              )}
              {/* Displays set username component as a fallback */}
              <Route component={SetCockatriceName} />
            </Switch>
          )}
          {/* Displays our Login components as a fallback */}
          <Route component={Login} />
        </Switch>
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.email,
    isAdmin: state.user.accessLevel >= 5,
    hasCockaName: !!state.user.cockatriceName,
    username: state.user.cockatriceName,
    ELO: state.user.ELO
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
      dispatch(fetchDecks())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  hasCockaName: PropTypes.bool.isRequired
}
