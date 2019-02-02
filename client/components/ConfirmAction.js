import React from 'react'

export default ({text, confirm, deny, confirmText, denyText}) => {
  console.log(confirmText, denyText)
  return (
    <div className='column center'>
      {text && <p>{'Are you sure?'}</p>}
      <button onClick={confirm}>
        {!!confirmText ? confirmText : 'Yes'}
      </button>
      <button onClick={deny}>
        {!!denyText ? denyText : 'No'}
      </button>
    </div>
  )
}