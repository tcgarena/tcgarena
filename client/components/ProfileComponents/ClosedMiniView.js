import React, {useEffect, useState} from 'react'
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import {DeckPreview} from '..'

const ClosedMiniView = ({history, match}) => {
  const [mini, setMini] = useState({})
  const [timeUntilPublic, setTime] = useState()

  const fetchMini = async () => {
    const {data: mini} = await axios.get(`/api/minis/closed/${match.params.miniUuid}`)
    setMini(mini)
  }

  useEffect(() => {
    const getMini = !Object.keys(mini).length 
    getMini && fetchMini()
  })

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
    </div>
  }

  return <div>{Object.keys(mini).length && showMini()}</div>
}


export default withRouter(ClosedMiniView)
