import React from 'react'

const ErrorList = ({ errors }) => {
  return (
    <div className='error-list'>
      {
        errors.map( (error, idx) => (
          <p key={idx} className='error-list-element'>{error}</p>
        ))
      }
    </div>
  )
}

export default ErrorList