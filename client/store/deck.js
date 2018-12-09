import axios from 'axios'

const GOT_DECKS_FROM_SERVER = 'GOT_DECKS_FROM_SERVER'
const GOT_NEW_DECK_FROM_SERVER = 'GOT_NEW_DECK_FROM_SERVER'
export const gotDecksFromServer = decks => ({ type: GOT_DECKS_FROM_SERVER, decks })
export const gotNewDeckFromServer = deck => ({ type: GOT_NEW_DECK_FROM_SERVER, deck})

export const fetchDecks = () => {
  return async dispatch => {
    const { data } = await axios.get('/api/decks')
    const action = gotDecksFromServer(data)
    dispatch(action)
  }
}

export const saveDeck = deck => {
  return async dispatch => {
    const { data } = await axios.post('/api/decks', deck)
    const action = gotNewDeckFromServer(data)
    dispatch(action)
  }
}

const initState = {
  decks: []
}

export default (state = initState, action) => {
  switch (action.type) {
    case GOT_DECKS_FROM_SERVER:
      return { ...state, decks: action.decks }
    case GOT_NEW_DECK_FROM_SERVER:
      return { ...state, decks: [ ...state.decks, action.deck ] }
    default:
      return state
  }
}

