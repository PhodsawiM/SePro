import React from 'react'
import './BoxContainer.css'
function BoxContainer({children}) {

  return (
    <div className='BOXXO'>
        {children}
    </div>
  )
}

export default BoxContainer