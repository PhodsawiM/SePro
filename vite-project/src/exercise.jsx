import React from 'react'
import excercise2 from './excercise2'
import ImgNha from './assets/img.svg'
import './exercise.css'
import IRight from './assets/right.svg'
function Exercise() {
  const selectBox = <div className='SubBoxCer'>
    <div className='ItemImg'>
        <img src={ImgNha} width={70} alt="" />
    </div>
    <div className='ItemText'>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos, laudantium?
    </div>
    <div className='GoToEx'>
      <a  style={{ cursor: 'pointer'}}>
        <img src={IRight} width={60} alt="" />
      </a>
    </div>
  </div>
  return (
    <div style={{'minHeight':'700px','width':'100%'}}>
        <h1>Excersise</h1>
        <div className='VBOX'>
            <div className='VBOXcon'>
            {/* <div className='SubBoxCer'>
              hi content
              <a  style={{ cursor: 'pointer',backgroundColor:'black'}}>
                <img src={IRight} style={{color:'black'}} width={70} alt="" />
              </a>
              </div> */}
              {selectBox}
              {selectBox}
              {selectBox}
              {selectBox}
              {selectBox}
              {selectBox}
              {selectBox}
            </div>
        </div>  
    </div>
  )
}

export default Exercise