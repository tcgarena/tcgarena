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
  
  toggleAdd = () => this.setState({isAdding: !this.state.isAdding})

  joinButton = () => {
    const {joinMini} = this.props
    const {miniId} = this.props.match.params
    return {
      text: 'Choose deck',
      action: deckId => joinMini(miniId, deckId)
    }
  }

  render() {
    return this.state.isAdding 
      ? (
        <div>
          <AddDeckForm redirect={this.toggleAdd}/>
        </div>
      )
      : (
        <div>
          <button onClick={this.toggleAdd}>
            Add Deck
          </button>
          <DecksList actionButton={this.joinButton} />
        </div>
      )
  }
}

const mapDispatch = { joinMini }

export default withRouter(
  connect(null, mapDispatch)(JoinMiniForm)
)