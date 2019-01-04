import axios from 'axios'
import socket from '../socket'

const GOT_MINIS = 'GOT_MINIS'
const FETCH_MINI = 'FETCH_MINI'
const REMOVE_MINIS = 'REMOVE_MINIS'
const REMOVE_MINI = 'REMOVE_MINI'
const SOCKET_UPDATE = 'MINI_SOCKET_UPDATE'

export const removeMinis = () => ({ type: REMOVE_MINIS })
export const removeMiniById = id => ({ type: REMOVE_MINI, id })
export const getMini = (state, miniId) => state.mini[miniId]
export const socketUpdate = (miniId, update) => ({ type: SOCKET_UPDATE, miniId, update})

export const fetchMinis = () => async dispatch => {
  try {
    const { data: minis } = await axios.get('/api/minis')
    dispatch({ type: GOT_MINIS, minis })
  } catch (e) {
    console.error(e)
  }
}

export const fetchMini = miniId => async dispatch => {
  try {
    const { data: mini } = await axios.get(`/api/minis/${miniId}`)
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

export const joinMini = (miniId, deckId) => async dispatch => {
  try {
    await axios.put(`/api/minis/${miniId}/join`, {deckId})
  } catch(e) {
    console.error(e)
  }
}

export const startMini = miniId => async dispatch => {
  try {
    await axios.put(`/api/minis/${miniId}/start`)
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
        [action.mini.id]: action.mini
      }
    case SOCKET_UPDATE:
      return {
        ...state,
        [action.miniId]: {
          ...state[action.miniId],
          ...action.update
        }
      }
    case REMOVE_MINI:
      const { [action.id]: _, otherMinis } = state
      return { ...otherMinis }
    case REMOVE_MINIS:
      return initState
    default:
      return state
  }
}
