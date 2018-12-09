import axios from 'axios'

const GOT_DECKS_FROM_SERVER = 'GOT_DECKS_FROM_SERVER'
const GOT_NEW_DECK_FROM_SERVER = 'GOT_NEW_DECK_FROM_SERVER'
const REMOVE_DECKS = 'REMOVE_DECKS'
export const gotDecksFromServer = decks => ({ type: GOT_DECKS_FROM_SERVER, decks })
export const gotNewDeckFromServer = deck => ({ type: GOT_NEW_DECK_FROM_SERVER, deck})
export const removeDecks = () => ({type: REMOVE_DECKS})

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
    return data
  }
}

const initState = {}

export default (state = initState, action) => {
  switch (action.type) {
    case GOT_DECKS_FROM_SERVER:
      return { 
        ...action.decks.reduce((obj, item) => {
          obj[item.id] = item
          return obj
        }, {}) 
      }
    case GOT_NEW_DECK_FROM_SERVER:
      return {
        ...state,
        [action.deck.id]: action.deck
      }
    case REMOVE_DECKS:
      return initState
    default:
      return state
  }
}
