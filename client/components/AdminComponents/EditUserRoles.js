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
      const users = usersArr.reduce( (obj, _, i) => {
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

  userForms() {
    const userRoleOptions = [
      'user', 'judge1', 'judge2', 'judge3',
      'moderator', 'tc', 'admin'
    ]
    const users = Object.keys(this.state.users).reduce( (arr, key) => {
      arr.push(this.state.users[key])
      return arr
    }, [])

    return users.map( (user, i) => {
      return (
        <div key={user.id}>
          <form className='edit-user-role-form' onSubmit={() => this.updateRole(user.id, user.targetRole)}>
            <p>{user.cockatriceName}</p>
            <p>{user.role}</p>
            <select name={user.id} value={this.state.users[user.id].targetRole} onChange={this.handleChange}>
              {userRoleOptions.map(option => (
                  <option name='option' key={option} value={option} >{option}</option>
                )
              )}
            </select>
            <input type="submit" value="Submit" />
          </form>
        </div>
      )
    })
  }

  render() {
    const showUsers = Object.keys(this.state.users).length > 0
    return showUsers && (
      <div>
        {this.userForms()}
      </div>
    )
  }
}


export default EditUserRoles