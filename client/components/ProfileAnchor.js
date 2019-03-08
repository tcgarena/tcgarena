import React from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

const ProfileAnchor = ({history, username, ELO}) => (
  <div 
    id="profile-anchor"
    onClick={()=>{
      history.push(`/user/${username}`)
    }}
  >
    {username} ({ELO})
  </div>
)

const mapState = ({user}) => ({
  username: user.cockatriceName,
  ELO: user.ELO
})

export default withRouter(connect(mapState)(ProfileAnchor))