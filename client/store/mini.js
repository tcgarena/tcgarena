import axios from 'axios'

const GOT_MINIS_FROM_SERVER = 'GOT_MINIS_FROM_SERVER'
const GOT_NEW_MINI_FROM_SERVER = 'GOT_NEW_MINI_FROM_SERVER'
const USER_REQ_JOIN_MINI = 'USER_REQ_JOIN_MINI'
export const gotMinisFromServer = minis => ({ type: GOT_MINIS_FROM_SERVER, minis })
export const gotNewMiniFromServer = mini => ({ type: GOT_NEW_MINI_FROM_SERVER, mini })
export const userReqJoinMini = (miniId, userId) => ({ type: USER_REQ_JOIN_MINI, miniId, userId})

export const fetchMinis = () => {
  return async dispatch => {
    const { data } = await axios.get('/api/minis')
    const action = gotMinisFromServer(data)
    dispatch(action)
  }
}

export const createMini = mini => {
  return async dispatch => {
    const { data } = await axios.post('/api/minis', mini)
    const action = gotNewMiniFromServer(data)
    dispatch(action)
    // will need sockets here
  }
}

export const joinMini = (miniId, userId) => {
  return async dispatch => {
    const { data } = await axios.put(`/api/minis/join/${miniId}`)
    const action = userReqJoinMini(miniId, userId)
    dispatch(action)
    //sockets pls
  }
}

const initState = {
  minis: []
}

export default (state = initState, action) => {
  switch (action.type) {
    case GOT_MINIS_FROM_SERVER:
      return { ...state, minis: action.minis }
    case GOT_NEW_MINI_FROM_SERVER:
      return { ...state, minis: [ ...state.minis, action.mini ] }
    case USER_REQ_JOIN_MINI:
      return { ...state, minis: state.minis.map(mini => {
        if (mini.id === action.miniId) {
          return { ...mini, participants: [ ...mini.participants, action.userId ] }
        } else return { ...mini }
      })}
    default:
      return state
  }
}

