import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {auth, fetchDecks} from '../store'
import {ReCaptchaComponent} from './index'

/**
 * COMPONENT
 */
class AuthForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      verified: false
    }
    this.handleVerify = this.handleVerify.bind(this)
  }

  handleVerify() {
    this.setState(prevState => ({
      verified: !prevState.verified
    }))
  }

  render() {
    const {name, displayName, handleSubmit, error} = this.props
    return (
      <div id='auth-form'>
        <form onSubmit={handleSubmit} name={name} className="center column">
          <div>
            <label htmlFor="email">
              <small>Email</small>
            </label>
            <input className='auth-input' name="email" type="text" />
          </div>
          <div>
            <label htmlFor="password">
              <small>Password</small>
            </label>
            <input className='auth-input' name="password" type="password" />
          </div>
          {name === 'signup' ? (
            <ReCaptchaComponent handleVerify={this.handleVerify} />
          ) : (
            <div />
          )}
          {name === 'login' && (
            <div>
              <button id='auth-button' type="submit">Login</button>
            </div>
          )}
          {name === 'signup' &&
            this.state.verified && (
              <div>
                <button id='auth-button' type="submit">Signup</button>
              </div>
            )}
          {error && error.response && <div> {error.response.data} </div>}
        </form>
        {/* <a href="/auth/google">{displayName} with Google</a> */}
      </div>
    )
  }
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(auth(email, password, formName))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
