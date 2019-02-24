import React, {useEffect, useState} from 'react'
import {withRouter} from 'react-router-dom'
import axios from 'axios'

const ClosedMiniView = ({history, match}) => {
  const [mini, setMini] = useState({})

  const fetchMini = async () => {
    const {data: mini} = await axios.get(`/api/minis/closed/${match.params.miniUuid}`)
    setMini(mini)
  }

  useEffect(() => {!Object.keys(mini).length && fetchMini()})

  const showMini = () => {
    return <div>
      {mini.format}
    </div>
  }

  return <div>{mini && showMini(mini)}</div>
}


export default withRouter(ClosedMiniView)
