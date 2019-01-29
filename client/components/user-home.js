import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {me, fetchDecks} from '../store'


/**
 * COMPONENT
 */
export class UserHome extends Component {

  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    const {email} = this.props

  return (
    <div>
      <h3>Welcome, {email}</h3>
    </div>
  )
}
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email
  }
}
const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      console.log('loading initial data')
      dispatch(me())
      dispatch(fetchDecks())

    }
  }
}

export default connect(mapState, mapDispatch)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
