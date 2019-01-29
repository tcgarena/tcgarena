import React from 'react'
import {connect} from 'react-redux'
import {fetchDecks, selectDeck} from '../../store'
import {Route, Switch, withRouter} from 'react-router-dom'
import uniqFormats from '../../utils/uniqFormats'
import {AddDeckForm, NavFormats, DecksList, SingleDeckView, EditDeckForm, DeleteDeck} from '../index'

class DecksMenu extends React.Component {

  constructor(props) {
    super(props)
    this.actionButton = this.viewButton.apply(this)
  }

  // componentDidMount() {
  //   if (this.props.selectedDeck)
  //     this.props.history.push(`/decks/${this.props.selectedDeck}`)
  // }

  viewButton = () => ({
    text: 'View',
    action: deckId => this.props.history.push(`/decks/${deckId}`)
  })

  render() {
    const {decks} = this.props
    const decksArr = Object.keys(decks).map(key=>decks[key])
    const formats = uniqFormats(decksArr)
    return (
      <div className='decks-menu-main'>
        <Route exact path='/decks' render={() =>
          <button onClick={() => {
            this.props.history.push('/decks/add')
          }}>Add New Deck</button>
        } />
        <Route exact path='/decks' render={() =>
          <NavFormats formats={formats} />
        }/>
        <Route exact path='/decks' component={() =>
          <DecksList actionButton={this.actionButton} />
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
}

const mapStateToProps = ({decks, user: {selectedFormat}, user: {selectedDeck}}) => ({
  decks, selectedFormat, selectedDeck
})

const mapDispatchToProps = { fetchDecks, selectDeck }

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DecksMenu))
