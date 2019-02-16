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
    text: 'Join',
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
          <h5>No valid deck for this format, please add one.</h5>
          <AddDeckForm
            redirect={this.toggleAdd}
            showFormat={false}
          />
        </div>
      ) : (
        <div className='decks-menu-main'>
          <button onClick={this.toggleAdd}>
            Add New Deck
          </button>
          <DecksList actionButton={this.joinButton} />
        </div>
      )
  }
}

const mapState = ({decks, user: {selectedFormat}}) => ({
  hasDecks: Object.keys(decks).reduce(
    (prev, curr) => decks[curr].format === selectedFormat
      ? true : prev
    , false
  )
})

const mapDispatch = { joinMini }

export default withRouter(
  connect(mapState, mapDispatch)(JoinMiniForm)
)
