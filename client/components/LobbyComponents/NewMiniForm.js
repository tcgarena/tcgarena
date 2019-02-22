import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { createMini, selectFormat } from '../../store'
// import formats from '../../utils/formats'

class NewMiniForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      amountOfPlayers: 4,
      type: 'single elimination'
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    
    // selectedFormat is handled by redux so we have to deal with it seperately
    if (event.target.name === 'selectedFormat') 
      this.props.selectFormat(event.target.value)

    // every other form field is handled in local state
    else {
      const { name, value } = event.target
      this.setState({[name]: value})
    }

  }

  async handleSubmit(event) {
    event.preventDefault()
    try {
      const newMini = {
        format: this.props.selectedFormat,
        type: this.state.type,
        timePerRoundMins: 45,
        maxPlayers: parseInt(this.state.amountOfPlayers)
      }
      await this.props.createMini(newMini)
      this.props.cancel()
    } catch(e) { console.error(e) }
  }

  render() {
    const maxPlayersOptions = [4, 8, 16]
    const typeOptions = ['single elimination']
    const formats = ['standard','modern','legacy','vintage','pauper','frontier','historic']

    return (
      <div className='new-tournament-form'>
        <form className='new-tournament-form' onSubmit={this.handleSubmit}>
          <div className='row'>

            <select name='selectedFormat' value={this.props.selectedFormat} onChange={this.handleChange}>
              {formats.map(format => (
                  <option name='format' key={format} value={format} >{format}</option>
                )
              )}
            </select>  

            <select name='amountOfPlayers' value={this.state.amountOfPlayers} onChange={this.handleChange}>
              {maxPlayersOptions.map(option => (
                  <option name='option' key={option} value={option} >{option}</option>
                )
              )}
            </select>  

            <select name='type' value={this.state.type} onChange={this.handleChange}>
              {typeOptions.map(option => (
                  <option name='option' key={option} value={option} >{option}</option>
                )
              )}
            </select>  
          </div>
          
          <div className='new-tournament-form-buttons'>
            <input className='global-button' type="submit" value="Submit" />
            <button 
              className='global-button'          
              onClick={this.props.cancel}
              type='button'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }
}



const mapStateToProps = ({user: {selectedFormat}}) => ({
  selectedFormat
})

const mapDispatchToProps = {
  createMini,
  selectFormat
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewMiniForm))