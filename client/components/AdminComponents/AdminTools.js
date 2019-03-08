import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import SeedDB from './SeedDB'

const AdminTools = ({name}) => {
  return (
    <div>
      <div>
        <h1>Welcome {name}!</h1>
      </div>
      <div>
        <h2>Admin Tools</h2>
      </div>
      <div>
        <Link to="/admin/user-roles" className="nav-link">
          <h3>Edit User Permissions</h3>
        </Link>
        <Link to="/admin/minis" className="nav-link">
          <h3>Edit Active Minis</h3>
        </Link>
      </div>
      {name === 'morphiac' && <div className='seed-db'>
        <SeedDB />
      </div>}
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

export default connect(mapState)(AdminTools)


