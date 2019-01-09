import React from 'react'
import {connect} from 'react-redux'
import {MiniWindowView} from '../index'

const MiniList = ({ minis }) => (
  <div>
    { minis.map(mini => (
      <MiniWindowView mini={mini} key={mini.uuid} />
    ))}
  </div> 
)

const mapState = ({mini}) => ({
  minis: Object.keys(mini)
    .map( key => mini[key] )
})

export default connect(mapState)(MiniList)