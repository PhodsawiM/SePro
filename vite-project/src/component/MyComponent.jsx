import React from 'react'
import './CssCom.css/BTN.css'
function SubmitBTN({children}) {
  return (
    <>
        <button 
            // style={{"borderRadius":"7px",
            // "border":'0px',
            // "backgroundColor":'rgb(49, 98, 163)',
            // "color":'white',
            // "fontSize":"20px",
            // "fontWeight":"bold"
            // }}
            >
            {children}
        </button>
    </>
  )
}

export {SubmitBTN}