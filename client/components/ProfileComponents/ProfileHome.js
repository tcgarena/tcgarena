import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

const ProfileHome = props => {
  return (
    <div>
      <div>
        <h1>Welcome {props.name}!</h1>
      </div>
      <div>
        <h3>It is {new Date(Date.now()).toUTCString()}</h3>
      </div>
      <div>
        <h2>Profile Home</h2>
      </div>
      <div>
        <Link to="/profile/lifetime-minis-history" className="nav-link">
          <h3>Mini History</h3>
        </Link>
        <Link to="/profile/single-match-history" className="nav-link">
          <h3>Single Match Logs</h3>
        </Link>
      </div>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => ({
  // name: state.user.user.cockatriceName
  name: state.user.cockatriceName
})

export default connect(mapState)(ProfileHome)


