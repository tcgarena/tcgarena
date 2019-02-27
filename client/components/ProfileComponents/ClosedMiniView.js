import React, {useEffect, useState} from 'react'
import {withRouter} from 'react-router-dom'
import axios from 'axios'

const ClosedMiniView = ({history, match}) => {
  const [mini, setMini] = useState({})

  const fetchMini = async () => {
    const {data: mini} = await axios.get(`/api/minis/closed/${match.params.miniUuid}`)
    setMini(mini)
  }

  useEffect(() => {
    const getMini = !Object.keys(mini).length 
    getMini && fetchMini()
  })

  const showMini = () => {
    return <div>
      {mini.format}
    </div>
  }

  return <div>{mini && showMini()}</div>
}


export default withRouter(ClosedMiniView)
