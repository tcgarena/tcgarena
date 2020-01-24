import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {logout, closeHBmenu} from '../store'

const HamburgerMenu = ({visible, isLoggedIn, handleLogout, handleMouseLeave}) => {
  const positionSelf = () => {
    const navbar = document
      .getElementById('main-navbar')
      .getBoundingClientRect()

    const hamburgerMenu = document.getElementById('hamburger-menu')
    const hamburgerMenuBox = hamburgerMenu.getBoundingClientRect()

    const posX = navbar.right - 100
    const posY = navbar.bottom

    hamburgerMenu.style.left = posX +'px'
    hamburgerMenu.style.top = posY +'px'
  }

  useEffect(() => {
    if (document.getElementById('hamburger-button') && visible)
      positionSelf()
  })


  return isLoggedIn ? (
    <div hidden={visible} id="hamburger-menu"
      onMouseLeave={handleMouseLeave}
    >
      <div
        className='hamburger-menu-button'
        onClick={handleLogout}
      >logout</div>
    </div>
  ) : (
    <div hidden={visible} id="hamburger-menu">
      <div
        className='hamburger-menu-button'
        onClick={()=>{

        }}
      >login</div>
    </div>
  )
}

const mapState = state => {
  return {
    isLoggedIn: !!state.user.email,
    visible: !state.user.showHBmenu
  }
}

const mapDispatch = dispatch => {
  return {
    handleLogout() {
      dispatch(logout())
    },
    handleMouseLeave() {
      dispatch(closeHBmenu())
    }
  }
}

export default connect(mapState, mapDispatch)(HamburgerMenu)
