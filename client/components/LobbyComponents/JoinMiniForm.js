import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {joinMini} from '../../store'
import {DecksList, AddDeckForm} from '../index'

class JoinMiniForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isAdding: false
    }
    this.joinButton = this.joinButton.apply(this)
    this.toggleAdd = this.toggleAdd.bind(this)
  }

  forceAddDeck = () => {
    if (this.state.isAdding === false)
      this.setState({isAdding: true})
  }

  componentDidMount() {
    if (!this.props.hasDecks)
      this.forceAddDeck.apply(this)
  }

  componentDidUpdate() {
    if (!this.props.hasDecks)
      this.forceAddDeck.apply(this)
  }
  
  toggleAdd = () => this.setState({isAdding: !this.state.isAdding})

  joinButton = () => ({
    text: 'Choose deck',
    action: this.join.bind(this)
  })

  join = async deckId => {
    const {miniId} = this.props.match.params
    await this.props.joinMini(miniId, deckId)
    this.props.history.push(`/lobby/${miniId}`)
  }

  render() {
    return this.state.isAdding 
      ? (
        <div>
          {this.props.hasDecks && <button onClick={this.toggleAdd}>
            Cancel
          </button>}
          <AddDeckForm redirect={this.toggleAdd}/>
        </div>
      ) : (
        <div>
          <button onClick={this.toggleAdd}>
            Add Deck
          </button>
          <DecksList actionButton={this.joinButton} />
        </div>
      )
  }
}

const mapState = state => ({
  hasDecks: Object.keys(state.decks).reduce( 
    (prev, curr) => state.decks[curr].format === state.user.selectedFormat 
      ? true : prev
    , false
  )
})
const mapDispatch = { joinMini }

export default withRouter(
  connect(mapState, mapDispatch)(JoinMiniForm)
)