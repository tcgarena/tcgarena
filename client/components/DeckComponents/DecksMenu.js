import React from 'react'
import {connect} from 'react-redux'
import {fetchDecks, selectDeck} from '../../store'
import {Route, Switch, withRouter} from 'react-router-dom'
import uniqFormats from '../../utils/uniqFormats'
import {AddDeckForm, NavFormats, DecksList, SingleDeckList, EditDeckForm} from '../index'

class DecksMenu extends React.Component {

  componentDidMount() {
    if (this.props.selectedDeck)
      this.props.history.push(`/decks/${this.props.selectedDeck}`)
  }

  render() {
    const {decks} = this.props
    const decksArr = Object.keys(decks).map(key=>decks[key])
    const formats = uniqFormats(decksArr)
    return (
      <div id='decks-menu-main'>
        <Route exact path='/decks' render={() =>
          <button onClick={() => {
            this.props.history.push('/decks/add')
          }}>Add Deck</button>
        } />
        <Route exact path='/decks' render={() =>
          <NavFormats formats={formats} />
        }/>
        <Route exact path='/decks' component={DecksList} />

        <Switch>
          <Route exact path='/decks/add' component={AddDeckForm} />
          <Route exact path='/decks/:id' component={SingleDeckList} />
          <Route exact path='/decks/:id/edit' component={EditDeckForm} />
        </Switch>

      </div>
    )
  }
}

const mapStateToProps = ({decks, user: {selectedFormat}, user: {selectedDeck}}) => ({
  decks, selectedFormat, selectedDeck
})

const mapDispatchToProps = { fetchDecks, selectDeck }

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DecksMenu))
