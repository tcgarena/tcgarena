import React from 'react'
import classNames from 'classnames'
import Dropzone from 'react-dropzone'
import axios from 'axios'
import {withRouter} from 'react-router-dom'

class UploadFile extends React.Component {
  onDrop = (acceptedFiles, rejectedFiles) => {
    if (!acceptedFiles) {
      window.alert('check file and try again')
    } else {
      const reader = new FileReader()
      reader.onload = async () => {
        const fileAsBinaryString = reader.result
        await axios.post('/api/server-op/seed', JSON.parse(fileAsBinaryString))
        window.alert('seed success')
        this.props.history.push('/')
        location.reload()
      }
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')

      reader.readAsBinaryString(acceptedFiles[0])
    }
  }

  render() {
    return (
      <Dropzone onDrop={this.onDrop}>
        {({getRootProps, getInputProps, isDragActive}) => {
          return (
            <div className='dropzone'
              {...getRootProps()}
              className={classNames('dropzone', {
                'dropzone--isActive': isDragActive
              })}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Hope you know what you're doing...</p>
              ) : (
                <p>Seed database (won't work ;b)</p>
              )}
            </div>
          )
        }}
      </Dropzone>
    )
  }
}

export default withRouter(UploadFile)
