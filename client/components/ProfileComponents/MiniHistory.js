import React, {useState, useEffect} from 'react'
import {withRouter} from 'react-router-dom'
import axios from 'axios'

const MiniHistory = ({match, history}) => {
  const [minis, setMinis] = useState({})

  const fetchMinis = async () => {
    try {
      const cockatriceName = match.params.cockatriceName
      const {data: minis} = await axios.get(`/api/users/minis/${cockatriceName}`)
      setMinis(minis)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    const getMinis = !Object.keys(minis).length 
    getMinis && fetchMinis()
  })

  const showMinis = () => {
    const closedMinis = Object.keys(minis).reduce( (arr, key) => {
      arr.push(minis[key])
      return arr
    }, [])

    return (
      <div className='mini-history-container'>
        <u className='past-mini-header'>Past Minis</u>
        <div className='mini-history-list'>
          {closedMinis.map(mini => {
            return <div className='mini-history-item' key={mini.uuid}>
              <div className='mini-history-item-text'>{mini.format} {mini.type}</div>
              <div>{(new Date(mini.createdAt)).toLocaleString()}</div>
              <button className='global-button'
                onClick={() => history.push(`/mini/${mini.uuid}`)}
              >View</button>
            </div>
          })}
        </div>
      </div>
    )
  }

  return <div>{minis && showMinis()}</div>
}

export default withRouter(MiniHistory)
