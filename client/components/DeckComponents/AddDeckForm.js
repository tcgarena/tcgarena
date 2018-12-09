import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {ErrorList} from '../index'
import formats from '../../utils/formats'
import deckCheck from '../../utils/deckCheck'
import {selectFormat, saveDeck} from '../../store'

class AddDeckForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      decklist: '',
      deckName: '',
      errors: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.addDeck = this.addDeck.bind(this)
  }


  async addDeck() {
    const { decklist, deckName} = this.state
    const format = this.props.selectedFormat
    const { isLegal, errors } = await deckCheck(
      format, decklist, deckName
    )
    if (isLegal) {
      this.props.saveDeck({format, decklist, deckName})
      this.props.history.push('/decks')
    } else {
      this.setState({errors})
    }
  }

  handleChange(event) {
    if (event.target.name === 'selectedFormat') {
      this.props.selectFormat(event.target.value)
    } else {
      const { name, value } = event.target
      this.setState({[name]: value})
    }
  }

  handleSubmit(event) {
    event.preventDefault()
    this.addDeck()
  }

  render() {
    return (
      <div className='new-deck-form'>
        <form className='new-deck-form' onSubmit={this.handleSubmit}>
          <input className='deck-name-field' name='deckName' type='text' onChange={this.handleChange} value={this.state.deckName} />
          <select name='selectedFormat' value={this.props.selectedFormat} onChange={this.handleChange}>
            {formats.map(format => (
                <option name='format' key={format} value={format} >{format}</option>
              )
            )}
          </select>
          <textarea className='deck-field' name='decklist' value={this.state.decklist} onChange={this.handleChange} />  
          <input type="submit" value="Submit" />
        </form>
        <ErrorList errors={this.state.errors}  />
      </div>
    )
  }
}


const mapDispatchToProps = {
  selectFormat, saveDeck
}

const mapStateToProps = ({ user: {selectedFormat} }) => ({
  selectedFormat
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddDeckForm))