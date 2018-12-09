import React from 'react'
import {connect} from 'react-redux'
import {fetchDecks} from '../../store'
import {Route, Switch, withRouter} from 'react-router-dom'
import uniqFormats from '../../utils/uniqFormats'
import {AddDeckForm, NavFormats, DecksList, SingleDeckList} from '../index'

class DecksMenu extends React.Component {
  constructor(props) {
    super(props)
    this.selectDeck = this.selectDeck.bind(this)
    this.backButton = this.backButton.bind(this)
  }

  backButton() {
    this.props.history.push('/decks')
  }

  selectDeck(deck) {
    this.props.history.push(`/decks/${deck.id}`)
  }

  componentDidMount() {
    // this.props.fetchDecks()
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
        <Route exact path='/decks' render={() => 
          <DecksList 
            decks={decksArr.filter(deck => deck.format === this.props.selectedFormat)}
            selectDeck={this.selectDeck}
          />
        }/>
        
        <Switch>
          <Route exact path='/decks/add' component={AddDeckForm} />
          <Route exact path='/decks/:id' component={SingleDeckList} />
        </Switch>

      </div>
    )
  }
}

const mapStateToProps = ({decks, user: {selectedFormat}}) => ({ 
  decks, selectedFormat
})  

const mapDispatchToProps = { fetchDecks }

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DecksMenu))