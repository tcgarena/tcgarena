import axios from 'axios'
import history from '../history'
import {removeDecks, fetchDecks} from './decks'

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'
const SELECT_FORMAT = 'SELECT_FORMAT'
const SELECT_DECK = 'SELECT_DECK'
const DESELECT_DECK = 'DESELECT_DECK'
const SET_UUID = 'SET_UUID'

/**
 * INITIAL STATE
 */
const defaultUser = {
  selectedFormat: 'standard'
}

/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})
export const selectFormat = format => ({type: SELECT_FORMAT, format})
export const selectDeck = deckId => ({type: SELECT_DECK, deckId})
export const deselectDeck = () => ({type: DESELECT_DECK})
export const setUuid = uuid => ({type: SET_UUID, uuid})

/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  try {
    const res = await axios.get('/api/user')
    dispatch(getUser(res.data || defaultUser))
  } catch (err) {
    console.error(err)
  }
}

export const auth = (email, password, method) => async dispatch => {
  let res
  try {
    res = await axios.post(`/auth/${method}`, {email, password})
  } catch (authError) {
    return dispatch(getUser({error: authError}))
  }

  try {
    dispatch(getUser(res.data))
    dispatch(fetchDecks())
    history.push('/home')
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout')
    dispatch(removeUser())
    dispatch(removeDecks())
    history.push('/login')
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultUser, action) {
  switch (action.type) {
    case SET_UUID:
      return {...state, uuid: action.uuid}
    case GET_USER:
      return {...state, ...action.user}
    case REMOVE_USER:
      return defaultUser
    case SELECT_FORMAT:
      return {...state, selectedFormat: action.format}
    case SELECT_DECK:
      return {...state, selectedDeck: action.deckId}
    case DESELECT_DECK:
      const {selectedDeck: _, ...newState} = state
      return {...newState}
    default:
      return state
  }
}
