import React from 'react'
import axios from 'axios'

class EditUserRoles extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      users: {},
      response: ''
    }
    this.userForms = this.userForms.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.updateRole = this.updateRole.bind(this)
  }

  async componentDidMount() {
    try {
      const {data: usersArr} = await axios.get('/api/users/all')
      const users = usersArr.reduce((obj, _, i) => {
        const user = usersArr[i]
        user.targetRole = user.role
        obj[user.id] = user
        return obj
      }, {})
      this.setState({users})
    } catch (e) {
      console.error(e)
    }
  }

  async updateRole(userId, role) {
    const {data: response} = await axios.put('/api/users/role', {userId, role})
    this.setState({response: response.message})
    try {
      const {data: usersArr} = await axios.get('/api/users/all')
      const users = usersArr.reduce((obj, _, i) => {
        const user = usersArr[i]
        user.targetRole = user.role
        obj[user.id] = user
        return obj
      }, {})
      this.setState({users})
    } catch (e) {
      console.error(e)
    }
  }

  handleChange(e) {
    e.preventDefault()

    const {name, value} = e.target

    this.setState({
      users: {
        ...this.state.users,
        [name]: {
          ...this.state.users[name],
          targetRole: value
        }
      }
    })
  }

  handleSubmit = user => this.updateRole(user.id, user.targetRole)

  userForms() {
    const userRoleOptions = [
      'user',
      'judge1',
      'judge2',
      'judge3',
      'moderator',
      'tc',
      'admin'
    ]
    const users = Object.keys(this.state.users).reduce((arr, key) => {
      arr.push(this.state.users[key])
      return arr
    }, [])

    return users.map((user, i) => {
      return (
        <form className="tr" key={user.id}>
          <div className="td">{user.cockatriceName || 'N/A'}</div>
          <div className="td">{user.email || 'N/A'}</div>
          <div className="td">{user.role}</div>
          <div className="td">
            <select
              className='deck-format-field'
              name={user.id}
              value={this.state.users[user.id].targetRole}
              onChange={this.handleChange}
            >
              {userRoleOptions.map(option => (
                <option name="option" key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="td">
            <button className='edit-user-button' type="button" onClick={() => this.handleSubmit(user)}>
              Submit
            </button>
          </div>
        </form>
      )
    })
  }

  render() {
    const showUsers = Object.keys(this.state.users).length > 0
    return (
      showUsers && (
        <div className='temp'>
          <div id="edit-users-table">
            <div className="thead">
              <div className="tr">
                <div className="td">Cockatrice Name</div>
                <div className="td">Email</div>
                <div className="td">User Role</div>
                <div className="td">New Role</div>
                <div className="td" />
              </div>
            </div>
            <div className="tbody">{this.userForms()}</div>
          </div>
        </div>
      )
    )
  }
}

export default EditUserRoles
