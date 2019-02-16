import React from 'react'
import {connect} from 'react-redux'
import {MiniWindowView} from '../index'

const MiniList = ({minis}) => (
  <div id='mini-list-container'>
    {!minis.length
      ? <div style={{padding: 4}}>
          <p>No active minis :(</p>
          <p>Try asking a judge in the mini-beg channel on discord.</p>
        </div>
      : minis.map(mini => <MiniWindowView mini={mini} key={mini.uuid} />)}
  </div>
)

const mapState = ({mini}) => ({
  minis: Object.keys(mini).map(key => mini[key])
})

export default connect(mapState)(MiniList)
