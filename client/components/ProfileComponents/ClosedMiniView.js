import React, {useEffect, useState} from 'react'
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import {DeckPreview} from '..'
import msToTime from '../../utils/msToTime'

const ClosedMiniView = ({history, match}) => {
  const [mini, setMini] = useState({})
  const [timeUntilPublic, setTime] = useState(1)
  const [userlist, setUserlist] = useState('')

  const fetchMini = async () => {
    const {data: mini} = await axios.get(`/api/minis/closed/${match.params.miniUuid}`)
    setMini(mini)
    if (!mini.overFor24hrs) {
      const dayMs = 1000*60*60*24
      const timeLeft = dayMs - (Date.now() - new Date(mini.updatedAt).getTime())
      setTime(timeLeft)
    } else {
      setUserlist(mini.winner)
    }
  }

  useEffect(() => {
    const getMini = !Object.keys(mini).length 
    getMini && fetchMini()
    if (timeUntilPublic > 1000) {
      const timer = window.setInterval(() => setTime(time => time - 1000), 1000)
      return () => window.clearInterval(timer)
    } else if (!mini.overFor24hrs && Object.keys(mini).length) {
      // add a delay just incase the client slightly disagrees with the server
      setTimeout(() => fetchMini(), 1000)
    }
  }, [timeUntilPublic])

  const showMini = () => {
    const participantsArr = Object.keys(mini.users)
      .reduce( (arr, key) => {
        const user = mini.users[key]
        const winner = mini.winner === user.cockatriceName
        arr.push(<div 
          className={`single-mini-participants pointer ${
            userlist === user.cockatriceName ? 'highlight' : ''
          }`}
          key={user.cockatriceName}
          onClick={() => history.push(`/user/${user.cockatriceName}`)}
          onMouseOver={() => mini.overFor24hrs && setUserlist(user.cockatriceName)}
        >
          {user.cockatriceName} ({user.ELO}) {winner && '(winner)'}
        </div>)
        return arr
      }, [])

    return <div className='closed-mini-view'>
      <div>{mini.format} {mini.type}</div>
      <div>{(new Date(mini.createdAt).toLocaleString())}</div>
      {!mini.overFor24hrs && <div>{msToTime(timeUntilPublic)} until decklists go public.</div>}
      <div className='row' style={{marginTop: 5}}>
        <div style={{marginRight: 10}}>
          {participantsArr}
        </div>
        {mini.overFor24hrs && userlist!== '' && <DeckPreview list={mini.users[userlist].decklist} />}
      </div>

    </div>
  }

  return <div>{Object.keys(mini).length && showMini()}</div>
}


export default withRouter(ClosedMiniView)
