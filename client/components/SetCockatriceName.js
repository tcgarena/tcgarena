import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import {me} from '../store'

class SetCockatriceName extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cockatriceName: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.accept = this.accept.bind(this)
    this.reject = this.reject.bind(this)
  }

  async accept() {
    await axios.post('/api/user/cockaName', {
        cockatriceName: this.state.cockatriceName
    })
    this.props.me()
  }

  reject() {
    this.setState({cockatriceName: ''})
    window.alert('That name is already taken!')
  }

  
  async userNameCheck() {
    const {data: existingUser} = await axios.get(`/api/users/${this.state.cockatriceName}`)
    existingUser
      ? this.reject()
      : this.accept()
  }
  
  handleChange(event) {
    this.setState({cockatriceName: event.target.value})
  }
  
  handleSubmit(event) {
    event.preventDefault()
    this.userNameCheck()
  }

  render() {
    return (
      <div>
        <h3>Set your cockatrice username to continue...</h3>
        <form className='cockatrice-name-form' onSubmit={this.handleSubmit}>
          <input className='cockatrice-name-field' type='text' onChange={this.handleChange} value={this.state.cockatriceName} />
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
  
}

const mapDispatchToProps = {
  me
}

export default connect(null, mapDispatchToProps)(SetCockatriceName)