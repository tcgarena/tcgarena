import React from 'react'
import {connect} from 'react-redux'
import store, {selectFormat} from '../store'

const NavFormats = ({formats, selectedFormat, selectFormat}) => {
  let foundSelected = false
  const nav = formats.map( (format, idx) => {
    const isSelected = format === selectedFormat
    if (isSelected) foundSelected = true
    return (
      <div onClick={event => selectFormat(event.target.innerHTML)} key={idx} className={`lobby-navbar-item ${isSelected ? 'lobby-navbar-selected' : ''}`}>
        {format}
      </div>
    )
  })

  if (!foundSelected) store.dispatch(selectFormat(formats[0]))

  return (
    <div id='lobby-navbar-formats'>
      {nav}
    </div>
  ) 
}

const mapStateToProps = ({user: {selectedFormat}}) => ({selectedFormat})
const mapDispatchToProps = { selectFormat }

export default connect(mapStateToProps, mapDispatchToProps)(NavFormats)
