import React from 'react'
import {connect} from 'react-redux'
import {selectFormat} from '../store'

const NavFormats = ({formats, selectedFormat, selectFormat}) => (
  <div id='lobby-navbar-formats'>
  {
    formats.map( (format, idx) => {
      const isSelected = format === selectedFormat
      return (
        <div onClick={event => selectFormat(event.target.innerHTML)} key={idx} className={`lobby-navbar-item ${isSelected ? 'lobby-navbar-selected' : ''}`}>
          {format}
        </div>
      )
    })
  }
  </div>
) 

const mapStateToProps = ({user: {selectedFormat}}) => ({selectedFormat})
const mapDispatchToProps = { selectFormat }

export default connect(mapStateToProps, mapDispatchToProps)(NavFormats)
