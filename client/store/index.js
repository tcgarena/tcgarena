import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './user'
import decks from './decks'
import mini from './mini'
import {loadState, saveState} from './localStorage'

const reducer = combineReducers({user, decks, mini})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)

const persistedState = loadState()

let store
if (process.env.NODE_ENV === 'production') {
  store = createStore(reducer, persistedState)
} else {
  store = createStore(reducer, persistedState, middleware)
}

store.subscribe( () => {
  saveState({
    user: {
      selectedFormat: store.getState().user.selectedFormat,
      selectedDeck: store.getState().user.selectedDeck
    },
    decks: store.getState().decks
  })
})

export default store
export * from './user'
export * from './decks'
export * from './mini'