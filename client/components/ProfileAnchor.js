import React from 'react'
import {withRouter} from 'react-router-dom'

const ProfileAnchor = ({history, username, ELO}) => <div 
id="profile-anchor"
onClick={()=>{
  history.push(`/user/${username}`)
}}
>
  {username} {ELO}
</div>

export default withRouter(ProfileAnchor) 