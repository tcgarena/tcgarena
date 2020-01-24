import React from 'react'
import {connect} from 'react-redux'
import {Route, Switch, withRouter} from 'react-router-dom'
import {NewMiniForm} from '../index'
// import {} from '../../store'

class LobbyJudgePanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newMini: false
    }
    this.newMiniButton = this.newMiniButton.apply(this)
  }

  newMiniButton() {
    return <button
      onClick={
        () => this.setState({newMini: true})
      }
    >New Mini</button>
  }

  render() {
    const {newMini} = this.state
    return (
      <div id='lobby-judge-panel'>
        {
          newMini
            ? <NewMiniForm cancel={
              () => this.setState({newMini: false})
            } />
            : this.newMiniButton
        }
      </div>
    )
  }
}

const mapState = ({}) => ({})
const mapDispatch = {}

export default withRouter(
  connect(mapState, mapDispatch)(LobbyJudgePanel)
)
