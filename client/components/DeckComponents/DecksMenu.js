import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {fetchDecks, selectDeck} from '../../store'
import {Route, Switch, withRouter} from 'react-router-dom'
import uniqFormats from '../../utils/uniqFormats'
import {AddDeckForm, NavFormats, DecksList, SingleDeckView, EditDeckForm, DeleteDeck} from '../index'

const DecksMenu = ({history, decks}) => {

  useEffect(() => {
    const noDecks = !Object.keys(decks).length
    const wrongPath = history.location.pathname.indexOf('/decks/add') == -1
    if (noDecks && wrongPath) history.push(`/decks/add`)
  })

  const viewButton = {
    text: 'View',
    action: deckId => history.push(`/decks/${deckId}`)
  }

  const decksArr = Object.keys(decks).map(key=>decks[key])
  const formats = uniqFormats(decksArr)

  return (
    <div className='decks-menu-main'>
      <Route exact path='/decks' render={() =>
        <NavFormats formats={formats} />
      }/>
      <Route exact path='/decks' render={() =>
        <button onClick={() => {
          history.push('/decks/add')
        }}
          style={{margin:8}}
        >Add New Deck</button>
      } />
      <Route exact path='/decks' component={() =>
        <DecksList actionButton={viewButton} />
      }/>

      <Switch>
        <Route exact path='/decks/add' component={AddDeckForm} />

        <Route exact path='/decks/:deckId/delete' component={DeleteDeck} />
        <Route exact path='/decks/:deckId/:action' component={EditDeckForm} />
        <Route exact path='/decks/:deckId' component={SingleDeckView} />
      </Switch>

    </div>
  )
}

const mapStateToProps = ({decks}) => ({
  decks
})

const mapDispatchToProps = { fetchDecks, selectDeck }

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DecksMenu))
