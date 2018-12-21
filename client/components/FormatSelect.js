import React from 'react'
import {connect} from 'react-redux'
import formats from '../utils/formats'
import {selectFormat} from '../store'

const FormatSelect = ({selectedFormat, selectFormat}) => (
  <select
    name="selectedFormat"
    value={selectedFormat}
    onChange={e => selectFormat(e.target.value)}
  >
  {formats.map(format => (
    <option name="format" key={format} value={format}>
      {format}
    </option>
  ))}
  </select>
)

const mapState = ({user: {selectedFormat}}) => ({
  selectedFormat
})

const mapDispatch = {
  selectFormat
}

export default connect(mapState, mapDispatch)(FormatSelect)