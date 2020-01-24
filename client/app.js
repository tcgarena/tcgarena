import React, {useEffect} from 'react'
import {Navbar, Sidebar, Feed, Player, HamburgerMenu} from './components'
import Routes from './routes'

const App = () => {
  const fixContentHeight = () => {
    const navbar = document
      .getElementById('main-navbar')
      .getBoundingClientRect()
    const player = document
      .getElementById('player-window')
      .getBoundingClientRect()
    const contentHeight = player.top - navbar.bottom
    document.getElementById('middle-row').style.height = contentHeight + 'px'
  }

  useEffect(() => {
    fixContentHeight()
    window.addEventListener('resize', fixContentHeight)
    return () => window.removeEventListener('resize', fixContentHeight)
  })

  return (
    <div id="main-app">
      <Navbar />
      <div id="middle-row">
        <Sidebar />
        <Routes />
        <Feed />
      </div>
      <Player />
      <HamburgerMenu />
    </div>
  )
}


export default App
