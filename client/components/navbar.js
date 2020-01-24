import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {NavLink, withRouter} from 'react-router-dom'
import {toggleHBmenu} from '../store'
import {Search} from './index'

const Navbar = ({toggleHB, isLoggedIn, isAdmin, history}) => {
  const fixLogoWidth = () => {
    const sidebar = document
      .getElementById('sidebar-container')
      .getBoundingClientRect()
    const sidebarWidth = sidebar.right - sidebar.left
    document.getElementById('main-navbar-logo').style.width =
      sidebarWidth + 'px'
  }

  useEffect(() => {
    fixLogoWidth()
    window.addEventListener('resize', fixLogoWidth)
    return () => {
      window.removeEventListener('resize', fixLogoWidth)
    }
  })

  return (
    <div id="main-navbar">
      <div className="row">
        <div onClick={()=>history.push('/')} id="main-navbar-logo">tcgarena</div>
        <Search />
      </div>
      {isLoggedIn ? (
        <div id="main-navbar-buttons">
          <img
            className="nav-icon"
            src="/assets/navbar/notification_bell_icon.svg"
          />
          <img className="nav-icon" src="/assets/navbar/messages_icon.svg" />
          <img onClick={toggleHB} id='hamburger-button' src="/assets/navbar/menu_icon.svg" />
        </div>
      ) : (
        <div id="main-navbar-buttons">
          <NavLink activeClassName="nav-active" to="/login">
            Login
          </NavLink>
          <NavLink activeClassName="nav-active" to="/signup">
            Sign Up
          </NavLink>
        </div>
      )}
    </div>
  )
}

const mapState = state => ({
  isLoggedIn: !!state.user.email,
  isAdmin: state.user.accessLevel >= 5
})

const mapDispatch = dispatch => ({
  toggleHB() {
    dispatch(toggleHBmenu())
  }
})

export default withRouter(connect(mapState, mapDispatch)(Navbar))

Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
