import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {ConfirmAction} from '../index';
import {deleteDeck, deselectDeck} from '../../store'

class DeleteDeck extends React.Component {
  constructor(props) {
    super(props)
    this.delete = this.delete.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  delete() {
    const {deckId} = this.props.match.params
    this.props.deleteDeck(deckId)
    this.props.history.push('/decks')
    this.props.deselectDeck()
  }

  cancel() {
    const {deckId} = this.props.match.params
    this.props.history.push(`/decks/${deckId}`)
  }

  render() {
    return (
      <div>
        <ConfirmAction
          confirm={this.delete}
          deny={this.cancel}
        />
      </div>
    )
  }
}

const mapDispatch = {
  deleteDeck, deselectDeck
}

export default withRouter(
  connect(null, mapDispatch)(DeleteDeck)
)
