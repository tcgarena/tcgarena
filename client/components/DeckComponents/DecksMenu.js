import React from 'react'
import {connect} from 'react-redux'
import {fetchDecks} from '../../store'
import {Route, Switch, withRouter} from 'react-router-dom'
import uniqFormats from '../../utils/uniqFormats'
import {AddDeckForm, NavFormats, DecksList, SingleDeckList} from '../index'

class DecksMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      deck: {}
    }
    this.selectDeck = this.selectDeck.bind(this)
    this.backButton = this.backButton.bind(this)
  }

  backButton() {
    this.props.history.push('/decks')
  }

  async selectDeck(deck) {
    await this.setState({deck})
    this.props.history.push(`/decks/${deck.id}`)
  }

  async componentDidMount() {
    console.log(this.props)
    await this.props.fetchDecks()
  }

  render() {
    const formats = uniqFormats(this.props.decks)
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
            decks={this.props.decks.filter(deck => deck.format === this.props.selectedFormat)}
            selectDeck={this.selectDeck}
          />
        }/>
        <Switch>
          <Route exact path='/decks/add' render={() =>
            <AddDeckForm />  
          }/>
          <Route exact path='/decks/:id' render={() => 
            <SingleDeckList 
              deck={this.state.deck}
              backButton={this.backButton}
            />
          }/>
        </Switch>

      </div>
    )
  }
}

const mapStateToProps = ({deck: {decks}, user: {selectedFormat}}) => ({ 
  decks, selectedFormat
})  

const mapDispatchToProps = { fetchDecks }

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DecksMenu))