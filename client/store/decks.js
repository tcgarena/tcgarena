import axios from 'axios'


const GOT_DECKS_FROM_SERVER = 'GOT_DECKS_FROM_SERVER'
const GOT_NEW_DECK_FROM_SERVER = 'GOT_NEW_DECK_FROM_SERVER'
const REMOVE_DECKS = 'REMOVE_DECKS'
const REMOVE_DECK = 'REMOVE_DECK'

export const gotDecksFromServer = decks => ({type: GOT_DECKS_FROM_SERVER, decks})
export const gotNewDeckFromServer = deck => ({type: GOT_NEW_DECK_FROM_SERVER, deck})
export const removeDecks = () => ({type: REMOVE_DECKS})
export const removeDeckById = id => ({type: REMOVE_DECK, id})

export const fetchDecks = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/decks')
    const action = gotDecksFromServer(data)
    dispatch(action)
  } catch(e) {console.error(e)}
}

export const saveDeck = deck => async dispatch => {
  try {
    const {data} = await axios.post('/api/decks', deck)
    const action = gotNewDeckFromServer(data)
    dispatch(action)
    return data
  } catch(e) {console.error(e)}
}

export const updateDeck = deck => async dispatch => {
  try {
    const {data} = await axios.put('/api/decks', deck)
    const action = gotNewDeckFromServer(data)
    dispatch(action)
    return data
  } catch(e) {console.error(e)}
}

export const deleteDeck = deckId => async dispatch => {
  try {
    await axios.delete(`/api/decks/${deckId}`)
    dispatch(removeDeckById(deckId))
  } catch(e) {console.error(e)}
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
    case REMOVE_DECK:
      // assigns the unwanted deck to lodash so we can return every deck except the unwanted one
      const {[action.id]: _, ...otherDecks} = state
      return {...otherDecks}
    case REMOVE_DECKS:
      return initState
    default:
      return state
  }
}
