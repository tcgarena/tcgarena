import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {logout, closeHBmenu} from '../store'

const HamburgerMenu = ({visible, isLoggedIn, handleLogout, handleMouseLeave}) => {
  const positionSelf = () => {
    const navbar = document
      .getElementById('main-navbar')
      .getBoundingClientRect()

    const hamburgerMenu = document.getElementById('hamburger-menu')

    const posX = navbar.right - 100
    const posY = navbar.top

    hamburgerMenu.style.left = posX +'px'
    hamburgerMenu.style.top = posY +'px'
    hamburgerMenu.style.paddingTop = navbar.bottom +'px'
  }

  const closeHB = m => {
    const hamburgerMenu = document.getElementById('hamburger-menu')
    if (!hamburgerMenu.hidden) {
      const hamburgerMenuBox = hamburgerMenu.getBoundingClientRect()
      if (m.clientX < hamburgerMenuBox.left) handleMouseLeave()
      if (m.clientX > hamburgerMenuBox.right) handleMouseLeave()
      if (m.clientY < hamburgerMenuBox.top) handleMouseLeave()
      if (m.clientY > hamburgerMenuBox.bottom) handleMouseLeave()
    }
  }

  useEffect(() => {
    if (document.getElementById('hamburger-button') && visible)
      positionSelf()
    window.addEventListener('resize', positionSelf)
    window.addEventListener('mousemove', m => closeHB(m))
    return () => {
      window.removeEventListener('resize', positionSelf)
      window.removeEventListener('mousemove', m => closeHB(m))
    }
  })

  return <div hidden={!visible} id="hamburger-menu">
    <div
      className='hamburger-menu-button'
      onClick={handleLogout}
    >logout</div>
  </div>

}

const mapState = state => {
  return {
    isLoggedIn: !!state.user.email,
    visible: !!state.user.showHBmenu
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
