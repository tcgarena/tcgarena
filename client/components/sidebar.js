import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {chooseSidebar, collapseSidebar} from '../store'

const Sidebar = ({collapsed, doCollapse, isLoggedIn, hasCockaName, isAdmin, username, history, selected, setSelected}) => {
  const setLogo = () => {
    const logo = document.getElementById('main-navbar-logo')
    const sidebar = document
      .getElementById('sidebar-container')
      .getBoundingClientRect()
    const sidebarWidth = sidebar.right - sidebar.left

    logo.style.width = sidebarWidth + 'px'
    setTimeout(() => {
      logo.innerHTML = collapsed ? 'tcga' : 'tcgarena'
    }, collapsed ? 100 : 250)
  }

  useEffect(() => {
    setLogo()
  })

  const createButton = (name, path=false) => {
    console.log(name, selected)
    return (
    <div
      className={
        name === selected ? 'sidebar-button-selected' : 'sidebar-button'
      }
      onClick={() => {
        history.push(path ? path : `/${name.toLowerCase()}`)
        setSelected(name)
      }}
    >
      <img className="sidebar-icon" src={`/assets/sidebar/${name.toLowerCase()}_icon.svg`} />
      {!collapsed && <div className="sidebar-button-text">{name}</div>}
    </div>
  )}

  return (
    <div id="sidebar-container">
      <div id="main-sidebar">
        {hasCockaName && createButton('Profile', `/user/${username}`)}
        {isLoggedIn && createButton('Lobby')}
        {isLoggedIn && createButton('Decks')}
        {isLoggedIn && createButton('Settings')}
        {isAdmin && createButton('Admin')}
        {createButton('About', '/')}
        <a href='https://discord.gg/DwNr2DD' target='_blank'>
          <img
            id={collapsed ? 'small-discord-button' : 'discord-button'}
            src={collapsed ? '/assets/sidebar/discord_small.svg' : '/assets/sidebar/discord.svg'}
          />
        </a>
      </div>

      <div id="sidebar-collapse" onClick={() => doCollapse(!collapsed)}>
        <img
          id="sidebar-collapse-icon"
          src={`/assets/sidebar/extend_sidebar_${
            collapsed ? 'right' : 'left'
          }.svg`}
        />
      </div>
    </div>
  )
}

const mapState = state =>  ({
  isLoggedIn: !!state.user.email,
  isAdmin: state.user.accessLevel >= 5,
  username: state.user.cockatriceName,
  hasCockaName: !!state.user.cockatriceName,
  selected: state.user.sidebar,
  collapsed:  state.user.collapseSB
})


const mapDispatch = dispatch => ({
  setSelected(name) {
    dispatch(chooseSidebar(name))
  },
  doCollapse(bool) {
    dispatch(collapseSidebar(bool))
  }
})

export default withRouter(connect(mapState, mapDispatch)(Sidebar))
