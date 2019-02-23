import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {NavLink, withRouter} from 'react-router-dom'
import {logout} from '../store'

const Navbar = ({handleClick, isLoggedIn, isAdmin, history}) => (
  <div className="center column">
    <h1 id='main-tcgarena' onClick={() => history.push('/')}>tcgarena</h1>
    <nav>
      {isLoggedIn ? (
        <div>
          {/* The navbar will show these links after you log in */}
          {/* <Link to="/home">Home</Link> */}
          <NavLink to="/lobby" activeClassName="nav-active">
            Lobby
          </NavLink>
          <NavLink to="/decks" activeClassName="nav-active">
            Decks
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" activeClassName="nav-active">
              Admin Tools
            </NavLink>
          )}
          <a href="#" onClick={handleClick}>
            Logout
          </a>
        </div>
      ) : (
        <div>
          {/* The navbar will show these links before you log in */}
          <NavLink activeClassName="nav-active" to="/login">
            Login
          </NavLink>
          <NavLink activeClassName="nav-active" to="/signup">
            Sign Up
          </NavLink>
        </div>
      )}
    </nav>
    <hr />
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id,
    isAdmin: state.user.accessLevel >= 5
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(Navbar))

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
