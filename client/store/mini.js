import axios from 'axios'
import socket from '../socket'
import store, {setUuid} from '.';


const GOT_MINIS = 'GOT_MINIS'
const FETCH_MINI = 'FETCH_MINI'
const REMOVE_MINIS = 'REMOVE_MINIS'
const REMOVE_MINI = 'REMOVE_MINI'
const SOCKET_UPDATE = 'MINI_SOCKET_UPDATE'

export const removeMinis = () => ({ type: REMOVE_MINIS })
export const removeMiniById = uuid => ({ type: REMOVE_MINI, uuid })
export const getMini = (state, miniUuid) => state.mini[miniUuid]
export const socketUpdate = (miniUuid, update) => ({ type: SOCKET_UPDATE, miniUuid, update})

export const fetchMinis = () => async dispatch => {
  try {
    const { data: minis } = await axios.get('/api/minis')
    dispatch({ type: GOT_MINIS, minis })
  } catch (e) {
    console.error(e)
  }
}

export const fetchMini = miniUuid => async dispatch => {
  try {
    const { data: mini } = await axios.get(`/api/minis/${miniUuid}`)
    dispatch({ type: FETCH_MINI, mini })
  } catch (e) {
    console.error(e)
  }
}

export const createMini = newMini => async dispatch => {
  try {
    await axios.post('/api/minis', newMini)
    // no need to dispatch, if all goes well creators client will get pinged back
  } catch(e) {
    console.error(e)
  }
}

export const joinMini = (miniUuid, deckId) => async dispatch => {
  try {
    await axios.put(`/api/minis/${miniUuid}/join`, {deckId})
  } catch(e) {
    console.error(e)
  }
}

export const startMini = miniUuid => async dispatch => {
  try {
    await axios.put(`/api/minis/${miniUuid}/start`)
  } catch (e) {
    console.error(e)
  }
}

export const nextRound = miniUuid => async dispatch => {
  try {
    await axios.put(`/api/minis/${miniUuid}/next-round`)
  } catch (e) {
    console.error(e)
  }
}

const initState = {}

export default (state = initState, action) => {
  switch (action.type) {
    case GOT_MINIS:
      return action.minis
    case FETCH_MINI:
      return {
        ...state,
        [action.mini.uuid]: action.mini
      }
    case SOCKET_UPDATE:
      return {
        ...state,
        [action.miniUuid]: {
          ...state[action.miniUuid],
          ...action.update
        }
      }
    case REMOVE_MINI:
      const { [action.uuid]: _, otherMinis } = state
      return { ...otherMinis }
    case REMOVE_MINIS:
      return initState
    default:
      return state
  }
}


export const getMyMatch = (state, miniUuid) => {
  const myUsername = state.user.cockatriceName
  let me, opponent
  const pairings = state.mini[miniUuid].pairings
  const pair = Object.keys(pairings).reduce( (pairing, key) => {
    let myPair
    for (let i=0; i<2; i++) 
      if (pairings[key][i].cockatriceName === myUsername) {
        // store.dispatch(setUuid(pairings[key][i]))
        myPair = true
      }
    return myPair ? pairings[key] : pairing
  }, {})

  if (Object.keys(pair).length) {
    for (let i=0; i<2; i++) 
      pair[i].cockatriceName === myUsername
        ? me = pair[i]
        : opponent = pair[i]
  } else {
    return false
  }
  return {me: {...me}, opponent: {...opponent}, uuid: pair.uuid}
}