import React from 'react'

export default ({text, confirm, deny, confirmText, denyText}) => {

  return (
    <div>
      {text && <p>{'Are you sure?'}</p>}
      <button className='global-button' onClick={confirm}>
        {!!confirmText ? confirmText : 'Yes'}
      </button>
      <button className='global-button' onClick={deny}>
        {!!denyText ? denyText : 'No'}
      </button>
    </div>
  )
}