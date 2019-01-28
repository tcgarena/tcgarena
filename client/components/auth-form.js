import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {auth, fetchDecks} from '../store'
import ReCaptchaComponent from './ReCaptcha'

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
      <div className="center column">
        <form onSubmit={handleSubmit} name={name} className="center column">
          <div>
            <label htmlFor="email">
              <small>Email</small>
            </label>
            <input name="email" type="text" />
          </div>
          <div>
            <label htmlFor="password">
              <small>Password</small>
            </label>
            <input name="password" type="password" />
          </div>
          <div>
            {name === 'signup' && (
              <div>
                <label htmlFor="betaKey">
                  <small>Beta key</small>
                </label>
                <input name="betaKey" type="text" />
              </div>
            )}
          </div>
          {name === 'signup' ? (
              <ReCaptchaComponent handleVerify={this.handleVerify} />
          ) : (
            <div />
          )}
          {name === 'login' && (
            <div>
              <button type="submit">Login</button>
            </div>
          )}
          {name === 'signup' &&
            this.state.verified && (
              <div>
                <button type="submit">Signup</button>
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
      const betaKey = formName === 'signup' ? evt.target.betaKey.value : ''
      dispatch(auth(email, password, formName, betaKey))
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
