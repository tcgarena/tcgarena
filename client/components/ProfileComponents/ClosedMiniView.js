import React, {useEffect, useState} from 'react'
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import {DeckPreview} from '..'
import msToTime from '../../utils/msToTime'

const ClosedMiniView = ({history, match}) => {
  const [mini, setMini] = useState({})
  const [timeUntilPublic, setTime] = useState(1)

  const fetchMini = async () => {
    const {data: mini} = await axios.get(`/api/minis/closed/${match.params.miniUuid}`)
    setMini(mini)
    if (!mini.overFor24hrs) {
      const dayMs = 1000*60*60*24
      const timeLeft = dayMs - (Date.now() - new Date(mini.updatedAt).getTime())
      setTime(timeLeft)
    }
  }

  useEffect(() => {
    const getMini = !Object.keys(mini).length 
    getMini && fetchMini()
    if (timeUntilPublic > 1000) {
      const timer = window.setInterval(() => setTime(time => time - 1000), 1000)
      return () => window.clearInterval(timer)
    } else if (!mini.overFor24hrs) {
      // add a delay just incase the client slightly disagrees with the server
      setTimeout(() => fetchMini(), 1000)
    }
  }, [timeUntilPublic])

  const showMini = () => {
    console.log(mini)
    const participantsArr = Object.keys(mini.users)
      .reduce( (arr, key) => {
        const user = mini.users[key]
        const winner = mini.winner === user.cockatriceName
        arr.push(<div 
          className='single-mini-participants' 
          key={user.cockatriceName}
          onClick={()=>history.push(`/user/${user.cockatriceName}`)}
        >
          {user.cockatriceName} ({user.ELO}) {winner && '(winner)'}
        </div>)
        return arr
      }, [])

    return <div className='closed-mini-view'>
      <div>{mini.format} {mini.type}</div>
      <div>{(new Date(mini.createdAt).toLocaleDateString())}</div>
      <div className='single-mini-participants-container'>
        {participantsArr}
      </div>
      <div>{!mini.overFor24hrs && msToTime(timeUntilPublic)}</div>
    </div>
  }

  return <div>{Object.keys(mini).length && showMini()}</div>
}


export default withRouter(ClosedMiniView)
