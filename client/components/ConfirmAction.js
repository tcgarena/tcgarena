import React from 'react'

export default ({confirm, deny}) => (
  <div className='column center'>
    <p>Are you sure?</p>
    <button onClick={confirm}>
      Yes
    </button>
    <button onClick={deny}>
      No
    </button>
  </div>
)