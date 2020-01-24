import React, {useState, useEffect} from 'react'
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import {MiniHistory} from '../index'

const UserPage = ({match}) => {
  const [user, setUser] = useState({})

  const fetchUser = async () => {
    const {data: user} = await axios.get(`/api/users/${match.params.cockatriceName}`)
    setUser(user)
  }

  // only re-fetches the user if the url changes
  useEffect(() => {fetchUser()}, [match.params.cockatriceName])

  const showUser = () => {
    return <div id='user-page'>
      <div className='user-page-name'>{user.cockatriceName} ({user.ELO})</div>
      <MiniHistory />
    </div>
  }

  return <div id='user-page-container'>{user && showUser()}</div>
}

export default withRouter(UserPage)


